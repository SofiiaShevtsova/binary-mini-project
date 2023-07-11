import { AbstractRepository } from '#libs/packages/database/database.js';

import {
  getCommentsCountQuery,
  getWhereUserIdQuery
} from './libs/helpers/helpers.js';

const fetchListOfUsersLikes = 'postReactions(withLikes) as likes .[user.image]';
const fetchListOfUsersDislikes =
  'postReactions(withDislikes) as dislikes .[user.image]';
const fetchUserImageAndImage = 'image, user.image';
class PostRepository extends AbstractRepository {
  constructor({ postModel }) {
    super(postModel);
  }

  getPosts(filter) {
    const { from: offset, count: limit, userId, isLike } = filter;

    if (isLike) {
      return this.model
        .query()
        .select(
          'posts.*',
          getCommentsCountQuery(this.model)
          // getReactionsQuery(this.model)(true),
          // getReactionsQuery(this.model)(false)
        )
        .joinRelated('postReactions')
        .where('postReactions.isLike', true)
        .where('postReactions.userId', userId)
        .where({ 'deletedAt': null })
        .withGraphFetched(
          `[${fetchUserImageAndImage}, ${fetchListOfUsersLikes}, ${fetchListOfUsersDislikes}]`
        )
        .orderBy('createdAt', 'desc')
        .offset(offset)
        .limit(limit);
    }

    return this.model
      .query()
      .select(
        'posts.*',
        getCommentsCountQuery(this.model)
        // getReactionsQuery(this.model)(true),
        // getReactionsQuery(this.model)(false)
      )
      .where(getWhereUserIdQuery(userId))
      .where({ 'deletedAt': null })
      .withGraphFetched(
        `[${fetchUserImageAndImage}, ${fetchListOfUsersLikes}, ${fetchListOfUsersDislikes}]`
      )
      .orderBy('createdAt', 'desc')
      .offset(offset)
      .limit(limit);
  }

  getPostById(id) {
    return this.model
      .query()
      .select(
        'posts.*',
        getCommentsCountQuery(this.model)
        // getReactionsQuery(this.model)(true),
        // getReactionsQuery(this.model)(false)
      )
      .where({ id })
      .withGraphFetched(
        `[comments.user.image, ${fetchUserImageAndImage}, ${fetchListOfUsersLikes}, ${fetchListOfUsersDislikes}]`
      )
      .first();
  }
}

export { PostRepository };
