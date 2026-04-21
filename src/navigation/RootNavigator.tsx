import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/Splash/SplashScreen';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import ArtifactDetailScreen from '../screens/Atlas/ArtifactDetailScreen';
import JournalEntryScreen from '../screens/Journal/JournalEntryScreen';
import ChallengeGameScreen from '../screens/Challenge/ChallengeGameScreen';
import ChallengeResultScreen from '../screens/Challenge/ChallengeResultScreen';
import MainTabs from './MainTabs';
import { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false, animation: 'fade' }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="ArtifactDetail" component={ArtifactDetailScreen} />
      <Stack.Screen name="JournalEntry" component={JournalEntryScreen} />
      <Stack.Screen name="ChallengeGame" component={ChallengeGameScreen} />
      <Stack.Screen name="ChallengeResult" component={ChallengeResultScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;