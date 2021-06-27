import {Collection, Model} from '@nozbe/watermelondb';
import Post from '../model/Post';

export function prepareCreatePost(collection: Collection<Post>): Post {
  const post = collection.prepareCreate((_post) => {
    const date = new Date();
    _post.title = `title: ${date.toISOString()}`;
    _post.subtitle = `subtitle: ${date.toISOString()}`;
    _post.body = `body: ${date.toISOString()}`;
    _post.isPinned = false;
  });
  return post;
}

export function prepareUpdatePost(post: Post, authorId: string): Post {
  const newPost = post.prepareUpdate((_post) => {
    const date = new Date();
    _post.title = `[Updated] title: ${date.toISOString()}`;
    _post.author.id = authorId;
  });
  return newPost;
}
