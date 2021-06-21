import {appSchema} from '@nozbe/watermelondb';
import Comment from './model/Comment';
import Post from './model/Post';

export default appSchema({
  version: 1,
  tables: [Post.schema, Comment.schema],
});
