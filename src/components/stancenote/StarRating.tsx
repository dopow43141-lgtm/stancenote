import { Pressable, StyleSheet, View } from 'react-native';

import { SymbolView } from 'expo-symbols';

import { useTheme } from '@/hooks/use-theme';

export function StarRating({
  value,
  onChange,
  size = 28,
  readonly,
}: {
  value: number | undefined;
  onChange?: (value: number | undefined) => void;
  size?: number;
  readonly?: boolean;
}) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = (value ?? 0) >= star;
        const star_ = (
          <SymbolView
            key={star}
            name={{ ios: filled ? 'star.fill' : 'star', android: 'star', web: 'star' }}
            tintColor={filled ? '#F5A623' : theme.textSecondary}
            size={size}
          />
        );
        if (readonly) return star_;
        return (
          <Pressable
            key={star}
            onPress={() => onChange?.(value === star ? undefined : star)}
            hitSlop={4}>
            {star_}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 4,
  },
});
