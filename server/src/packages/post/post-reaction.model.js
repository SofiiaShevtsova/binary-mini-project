import { Model } from 'objection';

import {
  AbstractModel,
  DatabaseTableName
} from '#libs/packages/database/database.js';
import { UserModel } from '#packages/user/user.js';

import { PostModel } from './post.js';

class PostReactionModel extends AbstractModel {
  static get tableName() {
    return DatabaseTableName.POST_REACTIONS;
  }

  static get jsonSchema() {
    const baseSchema = super.jsonSchema;

    return {
      type: baseSchema.type,
      required: ['isLike', 'userId', 'postId'],
      properties: {
        ...baseSchema.properties,
        isLike: { type: 'boolean' },
        postId: { type: ['integer', 'null'] },
        userId: { type: ['integer', 'null'] }
      }
    };
  }

  static get relationMappings() {
    return {
      post: {
        relation: Model.HasOneRelation,
        modelClass: PostModel,
        join: {
          from: `${DatabaseTableName.POST_REACTIONS}.postId`,
          to: `${DatabaseTableName.POSTS}.id`
        }
      },
      user: {
        relation: Model.HasOneRelation,
        modelClass: UserModel,
        filter: query => query.select('id', 'username', 'imageId'),
        join: {
          from: `${DatabaseTableName.POST_REACTIONS}.userId`,
          to: `${DatabaseTableName.USERS}.id`
        }
      }
    };
  }

  static get modifiers() {
    return {
      withLikes: query => query.select('id', 'userId').where({ isLike: true }),
      withDislikes: query =>
        query.select('id', 'userId').where({ isLike: false })
    };
  }
}

export { PostReactionModel };
