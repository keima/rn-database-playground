import {Model, tableSchema} from '@nozbe/watermelondb';
import {children, date, field, readonly} from '@nozbe/watermelondb/decorators';
import Comment from './Comment';
import {Associations} from '@nozbe/watermelondb/Model';

export default class Post extends Model {
  public static table = 'posts';

  public static schema = tableSchema({
    name: 'posts',
    columns: [
      {name: 'title', type: 'string'},
      {name: 'subtitle', type: 'string', isOptional: true},
      {name: 'body', type: 'string'},
      {name: 'is_pinned', type: 'boolean'},
      {name: 'created_at', type: 'number'},
      {name: 'updated_at', type: 'number'},
    ],
  });

  public static associations: Associations = {
    comments: {type: 'has_many', foreignKey: 'post_id'},
  };

  @field('title') title: string;
  @field('subtitle') subtitle?: string;
  @field('body') body: string;
  @field('is_pinned') isPinned: boolean;

  @readonly @date('created_at') createdAt: Date;
  @readonly @date('updated_at') updatedAt: Date;

  @children('comments') comments: Comment[];
}
