import { Pressable, StyleSheet, View } from 'react-native';

import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { t } from '@/i18n';
import { stanceTypeLabel, SettingRecord } from '@/types/setting';

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
  const dateLabel = date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' });
  const titleLabel = record.title || t('card.noTitle');
  const boardLabel = [record.boardBrand, record.boardModel].filter(Boolean).join(' ');
  const bindingLabel = [record.bindingBrand, record.bindingModel].filter(Boolean).join(' ');
  const equipmentParts = [boardLabel, bindingLabel].filter(Boolean);
  const sb = record.setbackCm ?? 0;
  const setPositionLabel = sb > 0
    ? t('detail.setback', { cm: sb })
    : sb < 0
      ? t('detail.setfront', { cm: Math.abs(sb) })
      : t('detail.center');

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
            <ThemedText type="smallBold" numberOfLines={1} style={styles.titleText}>
              {titleLabel}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {dateLabel}
            </ThemedText>
          </View>
          {equipmentParts.length > 0 && (
            <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
              {equipmentParts.join(' ／ ')}
            </ThemedText>
          )}
          <ThemedText type="small" themeColor="textSecondary">
            {stanceTypeLabel(record.stance)} {record.stanceWidthCm}cm ／ {t('card.front')}{record.frontAngleDeg}° {t('card.rear')}{record.rearAngleDeg}°
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {setPositionLabel}
          </ThemedText>
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
    alignItems: 'center',
    gap: Spacing.two,
  },
  titleText: {
    flex: 1,
  },
});
