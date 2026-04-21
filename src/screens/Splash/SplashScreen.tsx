import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenFrame from '../../components/ScreenFrame';
import SplashLogo from '../../components/SplashLogo';
import AnimatedBackdrop from '../../components/AnimatedBackdrop';
import { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    const t = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 3500);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <ScreenFrame variant="splash">
      <AnimatedBackdrop />
      <View style={styles.center}>
        <SplashLogo />
      </View>
    </ScreenFrame>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export default SplashScreen;