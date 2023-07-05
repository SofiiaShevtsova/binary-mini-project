import {
  Controller,
  ControllerHook
} from '#libs/packages/controller/controller.js';
import { HttpCode, HttpMethod } from '#libs/packages/http/http.js';
import {
  NotificationSocketEvent,
  SocketNamespace
} from '#libs/packages/socket/socket.js';

import { PostsApiPath } from './libs/enums/enums.js';

class PostController extends Controller {
  #postService;

  constructor({ apiPath, postService }) {
    super({ apiPath });
    this.#postService = postService;

    this.addRoute({
      method: HttpMethod.GET,
      url: PostsApiPath.ROOT,
      [ControllerHook.HANDLER]: this.getOnes
    });
    this.addRoute({
      method: HttpMethod.GET,
      url: PostsApiPath.$ID,
      [ControllerHook.HANDLER]: this.getById
    });
    this.addRoute({
      method: HttpMethod.POST,
      url: PostsApiPath.ROOT,
      [ControllerHook.HANDLER]: this.create
    });
    this.addRoute({
      method: HttpMethod.PUT,
      url: PostsApiPath.$ID,
      [ControllerHook.HANDLER]: this.update
    });

    this.addRoute({
      method: HttpMethod.DELETE,
      url: PostsApiPath.$ID,
      [ControllerHook.HANDLER]: this.delete
    });

    this.addRoute({
      method: HttpMethod.PUT,
      url: PostsApiPath.REACT,
      [ControllerHook.HANDLER]: this.react
    });
  }

  getOnes = request => this.#postService.getPosts(request.query);

  getById = request => this.#postService.getById(request.params.id);

  create = async (request, reply) => {
    const post = await this.#postService.create(request.user.id, request.body);

    request.io
      .of(SocketNamespace.NOTIFICATION)
      .emit(NotificationSocketEvent.NEW_POST, post); // notify all users that a new post was created
    return reply.status(HttpCode.CREATED).send(post);
  };

  update = async (request, reply) => {
    try {
      const response = await this.#postService.updatePost(
        request.user.id,
        request.body
      );
      return response || reply.status(HttpCode.NOT_FOUND);
    } catch (error) {
      return reply.status(HttpCode.FORBIDDEN).send(error.message);
    }
  };

  delete = async (request, reply) => {
    try {
      const response = await this.#postService.deletePost(
        request.params.id,
        request.user.id
      );
      return response || reply.status(HttpCode.NOT_FOUND);
    } catch (error) {
      return reply.status(HttpCode.FORBIDDEN).send(error.message);
    }
  };

  react = async request => {
    const reaction = await this.#postService.setReaction(
      request.user.id,
      request.body
    );

    const { likeCount, dislikeCount, id } = await this.#postService.getById(
      request.body.postId
    );

    if (reaction.post && reaction.post.userId !== request.user.id) {
      // notify a user if someone (not himself) liked his post
      const newReact = request.body.isLike
        ? NotificationSocketEvent.LIKE_POST
        : NotificationSocketEvent.DISLIKE_POST;
      request.io
        .of(SocketNamespace.NOTIFICATION)
        .to(`${reaction.post.userId}`)
        .emit(newReact);
    }
    // notify all users about reaction on post
    request.io
      .of(SocketNamespace.NOTIFICATION)
      .emit(NotificationSocketEvent.REACT_POST, id);

    return { likeCount, dislikeCount };
  };
}

export { PostController };
