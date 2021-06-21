import React, {useCallback} from 'react';
import {
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../App';
import Post from '../db/model/Post';
import {useObservable, useObservableState} from 'observable-hooks';
import {useDatabase} from '@nozbe/watermelondb/hooks';
import Comment from '../db/model/Comment';
import {prepareCreatePost} from '../db/dao/posts';
import {prepareCreateComment} from '../db/dao/comment';

type ListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'List'>;

type Props = {
  navigation: ListScreenNavigationProp;
};

const Component: React.FC<Props> = ({navigation}) => {
  const db = useDatabase();

  const postsCollection$ = useObservable<Post[]>(() =>
    db.collections
      .get<Post>('posts')
      // .query(Q.experimentalSortBy('updated_at', Q.asc))
      .query()
      .observe(),
  );

  const posts = useObservableState(postsCollection$);

  console.log('ListScreen: render', posts?.length);

  const renderItem = useCallback<ListRenderItem<Post>>(
    ({item}) => (
      <Pressable
        style={styles.cell}
        onPress={() => {
          navigation.navigate('Detail', {
            postId: item.id,
          });
        }}>
        <Text>ID: {item.id}</Text>
        <Text>タイトル: {item.title}</Text>
        <Text>更新: {item.updatedAt.toISOString()}</Text>
      </Pressable>
    ),
    [navigation],
  );

  const createPost = useCallback(async () => {
    const postsCollection = db.get<Post>(Post.table);

    db.action(async () => {
      const post = await postsCollection.create((_post) => {
        _post.title = 'title';
        _post.subtitle = 'subtitle';
        _post.body = 'Lorem Ipsum...';
        _post.isPinned = false;
      });
      console.log('post created:', post.id);
    });
  }, [db]);

  const bulkPostAndComments = useCallback(async () => {
    const postCollection = db.get<Post>(Post.table);
    const commentCollection = db.get<Comment>(Comment.table);

    const post = await prepareCreatePost(postCollection);
    const comment = await prepareCreateComment(commentCollection, post.id);

    await db.action(async () => {
      await db.batch(post, comment);
    });
  }, [db]);

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      ListEmptyComponent={<Text>No content</Text>}
      ListHeaderComponent={
        <>
          {global.HermesInternal == null ? null : <Text>Engine: Hermes</Text>}
        </>
      }
      ListFooterComponent={
        <>
          <Pressable onPress={createPost} style={styles.createButton}>
            <Text>Create Post</Text>
          </Pressable>
          <Pressable
            onPress={bulkPostAndComments}
            style={styles.createBulkButton}>
            <Text>Bulk Create</Text>
          </Pressable>
        </>
      }
    />
  );
};

const styles = StyleSheet.create({
  cell: {
    minHeight: 48,
    backgroundColor: 'lightblue',
    marginVertical: 4,
  },
  createButton: {
    height: 48,
    backgroundColor: 'lightgreen',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createBulkButton: {
    height: 48,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export {Component as ListScreen};
