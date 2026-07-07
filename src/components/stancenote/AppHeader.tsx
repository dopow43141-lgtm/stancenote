import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export function AppHeader() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
      <ThemedText type="subtitle" style={styles.logo}>
        StanceNote
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginHorizontal: -Spacing.four,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    backgroundColor: '#208AEF',
  },
  logo: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 36,
  },
});
