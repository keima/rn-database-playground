import {Model} from '@nozbe/watermelondb';
import {action, children, date, field, readonly} from '@nozbe/watermelondb/decorators'
import Comment from './Comment';
import {Associations} from '@nozbe/watermelondb/Model';
import {act} from "react-test-renderer"

export default class Post extends Model {
  public static table = 'posts';

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

  // @action async foo() {
  //   this.collection.create()
  //   this.markAsDeleted()
  // }
}
