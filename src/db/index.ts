import {Database} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import schema from './schema';
import Post from './model/Post';
import Comment from './model/Comment';

// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
  schema,
  // optional database name or file system path
  // dbName: 'myapp',
  // optional migrations
  // migrations,

  // synchronous mode only works on iOS.
  // improves performance and reduces glitches in most cases,
  // but also has some downsides - test with and without it
  // @ts-ignore 型なし
  synchronous: true,

  // experimental JSI mode, use only if you're brave
  // experimentalUseJSI: true,
});

// Then, make a Watermelon database from it!
const database = new Database({
  adapter,
  modelClasses: [Comment, Post],
  actionsEnabled: true,
});

export {database};
