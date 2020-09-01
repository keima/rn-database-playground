import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {ListScreen} from './ListScreen';
import {DetailScreen} from './DetailScreen';
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider';
import {database} from './db';

export type RootStackParamList = {
  List: undefined;
  Detail: {
    postId: string;
  };
};

const RootStack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <DatabaseProvider database={database}>
      <NavigationContainer>
        <RootStack.Navigator
          initialRouteName="List"
          screenOptions={{
            ...TransitionPresets.SlideFromRightIOS,
          }}>
          <RootStack.Screen
            name="List"
            component={ListScreen}
            options={{
              title: 'Posts',
            }}
          />
          <RootStack.Screen
            name="Detail"
            component={DetailScreen}
            options={{
              title: 'Post Detail',
            }}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    </DatabaseProvider>
  );
};

export default App;
