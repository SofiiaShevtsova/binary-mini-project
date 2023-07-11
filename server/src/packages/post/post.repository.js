import { AbstractRepository } from '#libs/packages/database/database.js';

import {
  getCommentsCountQuery,
  getReactionsQuery,
  getWhereUserIdQuery
} from './libs/helpers/helpers.js';

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
          getCommentsCountQuery(this.model),
          getReactionsQuery(this.model)(true),
          getReactionsQuery(this.model)(false)
        )
        .joinRelated('postReactions')
        .where('postReactions.isLike', true)
        .where('postReactions.userId', userId)
        .where({ 'deletedAt': null })
        .withGraphFetched('[image, user.image]')
        .orderBy('createdAt', 'desc')
        .offset(offset)
        .limit(limit);
    }

    return this.model
      .query()
      .select(
        'posts.*',
        getCommentsCountQuery(this.model),
        getReactionsQuery(this.model)(true),
        getReactionsQuery(this.model)(false)
      )
      .where(getWhereUserIdQuery(userId))
      .where({ 'deletedAt': null })
      .withGraphFetched('[image, user.image]')
      .orderBy('createdAt', 'desc')
      .offset(offset)
      .limit(limit);
  }

  getPostById(id) {
    return this.model
      .query()
      .select(
        'posts.*',
        getCommentsCountQuery(this.model),
        getReactionsQuery(this.model)(true),
        getReactionsQuery(this.model)(false)
      )
      .where({ id })
      .withGraphFetched('[comments.user.image, user.image, image]')
      .first();
  }
}

export { PostRepository };
