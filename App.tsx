import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { CollectionProvider } from './src/storage/CollectionContext';

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <CollectionProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </CollectionProvider>
    </SafeAreaProvider>
  );
};

export default App;