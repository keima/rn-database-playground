import React, {useCallback, useState} from 'react';
import {
  Button,
  FlatList,
  ListRenderItem,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import {useDatabase} from '@nozbe/watermelondb/hooks';
import {useObservable, useObservableState} from 'observable-hooks';
import Post from '../db/model/Post';
import Comment from '../db/model/Comment';
import {Q} from '@nozbe/watermelondb';

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;

const Component = () => {
  const db = useDatabase();
  const route = useRoute<DetailScreenRouteProp>();

  const post$ = useObservable<Post>(() =>
    db.collections.get<Post>('posts').findAndObserve(route.params.postId),
  );

  const comments$ = useObservable<Comment[]>(() =>
    db.collections
      .get<Comment>('comments')
      .query(Q.where('post_id', route.params.postId))
      .observe(),
  );

  const post = useObservableState(post$);
  const comments = useObservableState(comments$);

  const renderItem = useCallback<ListRenderItem<Comment>>(
    ({item}) => (
      <Pressable>
        <Text>{item.body}</Text>
        <Text>{item.createdAt.toDateString()}</Text>
      </Pressable>
    ),
    [],
  );

  const [commentBody, setCommentBody] = useState(
    `Comment on ${new Date().getTime()}`,
  );

  const addComment = useCallback(async () => {
    if (!post) {
      console.warn('Post is null');
      return;
    }

    const commentsCollection = db.collections.get<Comment>('comments');
    db.action(async () => {
      const newComment = await commentsCollection.create((c) => {
        c.body = commentBody;
        c.post.id = post.id;
      });
      console.log('created comment', newComment.id);
    });
  }, [commentBody, db, post]);

  return (
    <>
      <View>
        <Text>ID: {post?.id}</Text>
        <Text>タイトル: {post?.title}</Text>
        <Text>サブタイトル: {post?.subtitle}</Text>
        <Text>本文: {post?.body}</Text>
        <Text>ピン？: {post?.isPinned ? 'true' : 'false'}</Text>
        <Text>作成日時: {post?.createdAt.toDateString()}</Text>
        <Text>更新日時: {post?.updatedAt.toDateString()}</Text>
        <Text>コメント:</Text>
      </View>
      <FlatList
        data={comments}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No Content</Text>}
      />
      <View>
        <TextInput
          value={commentBody}
          onChangeText={(text) => setCommentBody(text)}
        />
        <Button title="送信" onPress={addComment} />
      </View>
    </>
  );
};

export {Component as DetailScreen};
