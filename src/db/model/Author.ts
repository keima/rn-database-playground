import {Model, Query, tableSchema} from '@nozbe/watermelondb';
import {Associations} from '@nozbe/watermelondb/Model';
import {children, date, field, readonly} from '@nozbe/watermelondb/decorators';
import Post from './Post';

export default class Author extends Model {
  static table = 'authors';

  static schema = tableSchema({
    name: 'authors',
    columns: [
      {name: 'name', type: 'string'},
      {name: 'created_at', type: 'number'},
      {name: 'updated_at', type: 'number'},
    ],
  });

  static associations: Associations = {
    posts: {type: 'has_many', foreignKey: 'author_id'},
  };

  @field('name') name: string;
  @readonly @date('created_at') createdAt: Date;
  @readonly @date('updated_at') updatedAt: Date;

  @children('posts') posts: Query<Post>;
}
