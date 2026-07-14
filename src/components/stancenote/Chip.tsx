import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      {selected ? (
        <ThemedView style={[styles.chip, styles.chipSelected]}>
          <ThemedText type="small" style={styles.selectedText}>
            {label}
          </ThemedText>
        </ThemedView>
      ) : (
        <ThemedView type="backgroundElement" style={styles.chip}>
          <ThemedText type="small" themeColor="textSecondary">
            {label}
          </ThemedText>
        </ThemedView>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
  chip: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.four,
  },
  chipSelected: {
    backgroundColor: '#208AEF',
  },
  selectedText: {
    color: '#FFFFFF',
  },
});
