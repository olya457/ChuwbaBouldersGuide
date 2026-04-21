import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AtlasScreen from '../screens/Atlas/AtlasScreen';
import CollectionScreen from '../screens/Collection/CollectionScreen';
import MapScreen from '../screens/Map/MapScreen';
import JournalScreen from '../screens/Journal/JournalScreen';
import DiscoveriesScreen from '../screens/Discoveries/DiscoveriesScreen';
import ChallengeIntroScreen from '../screens/Challenge/ChallengeIntroScreen';
import CustomTabBar from '../components/CustomTabBar';
import { MainTabParamList } from '../types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Atlas" component={AtlasScreen} />
      <Tab.Screen name="Collection" component={CollectionScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Journal" component={JournalScreen} />
      <Tab.Screen name="Discoveries" component={DiscoveriesScreen} />
      <Tab.Screen name="Challenge" component={ChallengeIntroScreen} />
    </Tab.Navigator>
  );
};

export default MainTabs;