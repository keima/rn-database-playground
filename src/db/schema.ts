import {appSchema} from '@nozbe/watermelondb';
import Comment from './model/Comment';
import Post from './model/Post';
import Author from './model/Author';

export default appSchema({
  version: 1,
  tables: [Post.schema, Comment.schema, Author.schema],
});
