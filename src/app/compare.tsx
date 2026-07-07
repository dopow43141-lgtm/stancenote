import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';

import { ScreenScrollView } from '@/components/stancenote/ScreenScrollView';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { t } from '@/i18n';
import { getSettingRecord } from '@/storage/settingsStorage';
import { ridingStyleLabel, stanceTypeLabel, SettingRecord } from '@/types/setting';

export default function CompareScreen() {
  const { a, b } = useLocalSearchParams<{ a: string; b: string }>();
  const [recordA, setRecordA] = useState<SettingRecord | undefined>();
  const [recordB, setRecordB] = useState<SettingRecord | undefined>();

  useFocusEffect(
    useCallback(() => {
      getSettingRecord(a).then(setRecordA);
      getSettingRecord(b).then(setRecordB);
    }, [a, b])
  );

  if (!recordA || !recordB) {
    return (
      <ScreenScrollView includeTabBarInset={false}>
        <ThemedText type="small" themeColor="textSecondary">
          {t('compareScreen.loading')}
        </ThemedText>
      </ScreenScrollView>
    );
  }

  const boardA = [recordA.boardBrand, recordA.boardModel].filter(Boolean).join(' ') || '-';
  const boardB = [recordB.boardBrand, recordB.boardModel].filter(Boolean).join(' ') || '-';
  const bindingA = [recordA.bindingBrand, recordA.bindingModel].filter(Boolean).join(' ') || '-';
  const bindingB = [recordB.bindingBrand, recordB.bindingModel].filter(Boolean).join(' ') || '-';

  const styleA = Array.isArray(recordA.ridingStyle) ? recordA.ridingStyle.map(ridingStyleLabel).join('・') : ridingStyleLabel(recordA.ridingStyle);
  const styleB = Array.isArray(recordB.ridingStyle) ? recordB.ridingStyle.map(ridingStyleLabel).join('・') : ridingStyleLabel(recordB.ridingStyle);

  const rows: { label: string; a: string; b: string }[] = [
    {
      label: t('compareScreen.date'),
      a: new Date(recordA.createdAt).toLocaleDateString(),
      b: new Date(recordB.createdAt).toLocaleDateString(),
    },
    { label: t('compareScreen.style'), a: styleA, b: styleB },
    { label: t('compareScreen.stance'), a: stanceTypeLabel(recordA.stance), b: stanceTypeLabel(recordB.stance) },
    { label: t('compareScreen.stanceWidth'), a: `${recordA.stanceWidthCm}cm`, b: `${recordB.stanceWidthCm}cm` },
    { label: t('compareScreen.frontAngle'), a: `${recordA.frontAngleDeg}°`, b: `${recordB.frontAngleDeg}°` },
    { label: t('compareScreen.rearAngle'), a: `${recordA.rearAngleDeg}°`, b: `${recordB.rearAngleDeg}°` },
    { label: t('compareScreen.setPosition'), a: `${recordA.setbackCm}cm`, b: `${recordB.setbackCm}cm` },
    { label: t('compareScreen.board'), a: boardA, b: boardB },
    { label: t('compareScreen.binding'), a: bindingA, b: bindingB },
    {
      label: t('compareScreen.review'),
      a: recordA.review ? '★'.repeat(recordA.review) : '-',
      b: recordB.review ? '★'.repeat(recordB.review) : '-',
    },
  ];

  return (
    <ScreenScrollView includeTabBarInset={false}>
      <ThemedText type="subtitle">{t('compareScreen.title')}</ThemedText>
      <View style={styles.table}>
        {rows.map((row) => {
          const diff = row.a !== row.b;
          return (
            <View key={row.label} style={styles.row}>
              <ThemedText type="small" themeColor="textSecondary" style={styles.labelCell}>
                {row.label}
              </ThemedText>
              <ThemedText type={diff ? 'smallBold' : 'small'} style={styles.valueCell}>
                {row.a}
              </ThemedText>
              <ThemedText type={diff ? 'smallBold' : 'small'} style={styles.valueCell}>
                {row.b}
              </ThemedText>
            </View>
          );
        })}
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  table: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  labelCell: {
    width: 90,
  },
  valueCell: {
    flex: 1,
  },
});
