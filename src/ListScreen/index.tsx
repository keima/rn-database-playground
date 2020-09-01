import React, {useCallback, useEffect, useState} from 'react';
import {
  Text,
  FlatList,
  Pressable,
  ListRenderItem,
  StyleSheet,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../App';
import Post from '../db/model/Post';
import {
  useObservable,
  useObservableEagerState,
  useObservableState,
  useSubscription,
} from 'observable-hooks';
import {useDatabase} from '@nozbe/watermelondb/hooks';
import {Database, Q} from '@nozbe/watermelondb';
import {of, interval, zip} from 'rxjs';
import {
  map,
  distinctUntilChanged,
  switchMap,
  catchError,
  startWith,
  mergeMap,
  tap,
  timeInterval,
  publish,
} from 'rxjs/operators';

type ListScreenRouteProp = RouteProp<RootStackParamList, 'List'>;
type ListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'List'>

type Props = {
  navigation: ListScreenNavigationProp;
};

const Component: React.FC<Props> = ({navigation}) => {
  // const [posts, setPosts] = useState<Post[]>([]);
  const db = useDatabase();

  // const x = useObservableState(
  //   zip(interval(1000), of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)).pipe(
  //     map((values) => values[1]),
  //     tap((value) => console.log('rx', value)),
  //   ),
  // );

  // :+1:
  // useSubscription(
  //   zip(interval(1000), of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)).pipe(
  //     map((values) => values[1]),
  //     tap((value) => console.log('rx.tap', value)),
  //   ),
  //   (value) => {
  //     console.log('rx.next', value);
  //   },
  //   (error) => {
  //     console.warn('ex.error', error);
  //   },
  //   () => {
  //     console.log('rx.complete');
  //   },
  // );

  const postsCollection$ = useObservable<Post[]>(() =>
    db.collections
      .get<Post>('posts')
      // .query(Q.experimentalSortBy('updated_at', Q.asc))
      .query()
      .observe(),
  );

  const posts = useObservableEagerState(postsCollection$);

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
    const postsCollection = db.collections.get<Post>('posts');

    db.action(async () => {
      const post = await postsCollection.create((post) => {
        post.title = 'title';
        post.subtitle = 'subtitle';
        post.body = 'Lorem Ipsum...';
        post.isPinned = false;
      });
      console.log('post created:', post.id);
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
});

export {Component as ListScreen};
