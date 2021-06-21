import {Model, Relation, tableSchema} from '@nozbe/watermelondb';
import {date, field, readonly, relation} from '@nozbe/watermelondb/decorators';
import {Associations} from '@nozbe/watermelondb/Model';
import Post from './Post';

export default class Comment extends Model {
  static table = 'comments';

  static schema = tableSchema({
    name: 'comments',
    columns: [
      {name: 'body', type: 'string'},
      {name: 'post_id', type: 'string', isIndexed: true},
      {name: 'created_at', type: 'number'},
      {name: 'updated_at', type: 'number'},
    ],
  });

  static associations: Associations = {
    posts: {type: 'belongs_to', key: 'post_id'},
  };

  @field('body') body: string;
  // @field('post_id') postId: string;

  @relation('posts', 'post_id')
  post: Relation<Post>;

  @readonly
  @date('created_at')
  createdAt: Date;
  @readonly @date('updated_at') updatedAt: Date;
}
