import {Collection} from '@nozbe/watermelondb';
import Comment from '../model/Comment';

export function prepareCreateComment(
  collection: Collection<Comment>,
  postId: string,
) {
  const comment = collection.prepareCreate((_comment) => {
    const date = new Date();
    _comment.body = `commentBody: ${date.toISOString()}`;
    _comment.post.id = postId;
  });
  return comment;
}

export function prepareUpdateComment(model: Comment, postId: string) {
  const newComment = model.prepareUpdate((_model) => {
    const date = new Date();
    _model.body = `updated body ${date.toISOString()}`;
    _model.post.id = postId;
  });
  return newComment;
}
