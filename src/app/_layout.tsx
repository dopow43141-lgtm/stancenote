import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';

import { Onboarding } from '@/components/stancenote/Onboarding';
import { Colors } from '@/constants/theme';
import { t } from '@/i18n';

const ONBOARDING_KEY = '@stancenote/onboarding_done';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const pathname = usePathname();
  const prevPathname = useRef<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    try { crashlytics().setCrashlyticsCollectionEnabled(true); } catch {}
    AsyncStorage.getItem(ONBOARDING_KEY).then((val) => {
      setShowOnboarding(val !== 'true');
      SplashScreen.hideAsync();
    });
  }, []);

  useEffect(() => {
    if (pathname && pathname !== prevPathname.current) {
      prevPathname.current = pathname;
      try {
        analytics().logScreenView({
          screen_name: pathname,
          screen_class: pathname,
        });
      } catch {}
    }
  }, [pathname]);

  if (showOnboarding === null) return null;

  if (showOnboarding) {
    return (
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
        <Onboarding
          onComplete={async () => {
            await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
            setShowOnboarding(false);
          }}
        />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
          }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="history/[id]"
            options={{ headerShown: true, title: t('screens.settingDetail') }}
          />
          <Stack.Screen name="compare" options={{ headerShown: true, title: t('screens.compare') }} />
          <Stack.Screen name="terms" options={{ headerShown: true, title: t('screens.terms') }} />
          <Stack.Screen name="privacy" options={{ headerShown: true, title: t('screens.privacy') }} />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
