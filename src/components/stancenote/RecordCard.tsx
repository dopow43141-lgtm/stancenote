import { Pressable, StyleSheet, View } from 'react-native';

import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { t } from '@/i18n';
import { ridingStyleLabel, SettingRecord } from '@/types/setting';

export function RecordCard({
  record,
  onPress,
  selectable,
  selected,
}: {
  record: SettingRecord;
  onPress: () => void;
  selectable?: boolean;
  selected?: boolean;
}) {
  const date = new Date(record.createdAt);
  const dateLabel = `${date.getMonth() + 1}/${date.getDate()}`;
  const boardLabel = [record.boardBrand, record.boardModel].filter(Boolean).join(' ');

  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView
        type={selected ? 'backgroundSelected' : 'backgroundElement'}
        style={styles.card}>
        {selectable && (
          <SymbolView
            name={{
              ios: selected ? 'checkmark.circle.fill' : 'circle',
              android: 'radio_button_unchecked',
              web: 'radio_button_unchecked',
            }}
            size={20}
          />
        )}
        <View style={styles.info}>
          <View style={styles.headerRow}>
            <ThemedText type="smallBold">{Array.isArray(record.ridingStyle) ? record.ridingStyle.map(ridingStyleLabel).join('・') : ridingStyleLabel(record.ridingStyle)}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {dateLabel}
            </ThemedText>
          </View>
          <ThemedText type="small" themeColor="textSecondary">
            {t('card.stance')}{record.stanceWidthCm}cm ／ {t('card.front')}{record.frontAngleDeg}° {t('card.rear')}{record.rearAngleDeg}°
          </ThemedText>
          {boardLabel !== '' && (
            <ThemedText type="small" themeColor="textSecondary">
              {boardLabel}
            </ThemedText>
          )}
        </View>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  info: {
    flex: 1,
    gap: Spacing.half,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
