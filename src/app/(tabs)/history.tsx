import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';

import { AppHeader } from '@/components/stancenote/AppHeader';
import { RecordCard } from '@/components/stancenote/RecordCard';
import { ScreenScrollView } from '@/components/stancenote/ScreenScrollView';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { t } from '@/i18n';
import { getSettingRecords } from '@/storage/settingsStorage';
import { SettingRecord } from '@/types/setting';

export default function HistoryScreen() {
  const [records, setRecords] = useState<SettingRecord[]>([]);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      getSettingRecords().then(setRecords);
    }, [])
  );

  function toggleCompareMode() {
    setCompareMode((mode) => !mode);
    setSelectedIds([]);
  }

  function handlePress(record: SettingRecord) {
    if (!compareMode) {
      router.push({ pathname: '/history/[id]', params: { id: record.id } });
      return;
    }
    setSelectedIds((ids) => {
      if (ids.includes(record.id)) {
        return ids.filter((id) => id !== record.id);
      }
      if (ids.length >= 2) {
        return [ids[1], record.id];
      }
      return [...ids, record.id];
    });
  }

  return (
    <ScreenScrollView>
      <AppHeader />
      <View style={styles.headerRow}>
        <ThemedText type="subtitle">{t('history.title')}</ThemedText>
        <Pressable onPress={toggleCompareMode}>
          <ThemedText type="link" themeColor={compareMode ? 'text' : 'textSecondary'}>
            {compareMode ? t('history.cancel') : t('history.compare')}
          </ThemedText>
        </Pressable>
      </View>

      {records.length === 0 && (
        <ThemedText type="small" themeColor="textSecondary">
          {t('history.empty')}
        </ThemedText>
      )}

      <View style={styles.list}>
        {records.map((record) => (
          <RecordCard
            key={record.id}
            record={record}
            selectable={compareMode}
            selected={selectedIds.includes(record.id)}
            onPress={() => handlePress(record)}
          />
        ))}
      </View>

      {compareMode && selectedIds.length === 2 && (
        <Pressable
          onPress={() =>
            router.push({
              pathname: '/compare',
              params: { a: selectedIds[0], b: selectedIds[1] },
            })
          }
          style={({ pressed }) => pressed && styles.pressed}>
          <ThemedView type="backgroundSelected" style={styles.compareButton}>
            <ThemedText type="smallBold">{t('history.compareSelected')}</ThemedText>
          </ThemedView>
        </Pressable>
      )}
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  list: {
    gap: Spacing.two,
  },
  pressed: {
    opacity: 0.7,
  },
  compareButton: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
  },
});
