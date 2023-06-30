class PostService {
  constructor({ postRepository, postReactionRepository }) {
    this._postRepository = postRepository;
    this._postReactionRepository = postReactionRepository;
  }

  getPosts(filter) {
    return this._postRepository.getPosts(filter);
  }

  getById(id) {
    return this._postRepository.getPostById(id);
  }

  create(userId, post) {
    return this._postRepository.create({
      ...post,
      userId
    });
  }

  async setReaction(userId, { postId, isLike }) {
    const updateOrDelete = react => {
      return react.isLike === isLike
        ? this._postReactionRepository.deleteById(react.id)
        : this._postReactionRepository.updateById(react.id, { isLike });
    };

    const reaction = await this._postReactionRepository.getPostReaction(
      userId,
      postId
    );

    reaction
      ? await updateOrDelete(reaction)
      : await this._postReactionRepository.create({ userId, postId, isLike });

    const countReaction = await this.getById(postId);

    return {
      likeCount: countReaction.likeCount,
      dislikeCount: countReaction.dislikeCount
    };
  }
}

export { PostService };
