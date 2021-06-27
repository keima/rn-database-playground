import {Collection} from '@nozbe/watermelondb';
import Author from '../model/Author';

export function prepareCreateAuthor(collection: Collection<Author>) {
  const author = collection.prepareCreate((_author) => {
    const date = new Date();
    _author.name = `AuthorName ${date.toISOString()}`;
  });
  return author;
}
