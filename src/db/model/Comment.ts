import {Model} from '@nozbe/watermelondb';
import {date, field, readonly} from '@nozbe/watermelondb/decorators';
import {Associations} from '@nozbe/watermelondb/Model';

export default class Comment extends Model {
  static table = 'comments';

  static associations: Associations = {
    posts: {type: 'belongs_to', key: 'post_id'},
  };

  @field('body') body: string;
  @field('post_id') postId: string;

  @readonly @date('created_at') createdAt: Date;
  @readonly @date('updated_at') updatedAt: Date;
}
