import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';

import { AppHeader } from '@/components/stancenote/AppHeader';
import { Chip } from '@/components/stancenote/Chip';
import { RecordCard } from '@/components/stancenote/RecordCard';
import { ScreenScrollView } from '@/components/stancenote/ScreenScrollView';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { t } from '@/i18n';
import { useTheme } from '@/hooks/use-theme';
import { getSettingRecords } from '@/storage/settingsStorage';
import { ridingStyleLabel, SettingRecord } from '@/types/setting';

type SortKey = 'date' | 'style' | 'board' | 'resort';

export default function HistoryScreen() {
  const theme = useTheme();
  const [records, setRecords] = useState<SettingRecord[]>([]);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('date');

  useFocusEffect(
    useCallback(() => {
      getSettingRecords().then(setRecords);
    }, [])
  );

  const filteredRecords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let result = records;

    if (query) {
      result = result.filter((r) => {
        const fields = [
          r.title,
          r.boardBrand,
          r.boardModel,
          r.bindingBrand,
          r.bindingModel,
          r.resort,
          r.memo,
          ...(Array.isArray(r.ridingStyle) ? r.ridingStyle.map(ridingStyleLabel) : [ridingStyleLabel(r.ridingStyle)]),
        ];
        return fields.some((f) => f?.toLowerCase().includes(query));
      });
    }

    const sorted = [...result];
    switch (sortKey) {
      case 'date':
        sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
      case 'style':
        sorted.sort((a, b) => {
          const aStyle = Array.isArray(a.ridingStyle) ? a.ridingStyle[0] : a.ridingStyle;
          const bStyle = Array.isArray(b.ridingStyle) ? b.ridingStyle[0] : b.ridingStyle;
          return (aStyle ?? '').localeCompare(bStyle ?? '');
        });
        break;
      case 'board':
        sorted.sort((a, b) => (a.boardBrand ?? '').localeCompare(b.boardBrand ?? ''));
        break;
      case 'resort':
        sorted.sort((a, b) => (a.resort ?? '').localeCompare(b.resort ?? ''));
        break;
    }
    return sorted;
  }, [records, searchQuery, sortKey]);

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

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: 'date', label: t('search.sortDate') },
    { key: 'style', label: t('search.sortStyle') },
    { key: 'board', label: t('search.sortBoard') },
    { key: 'resort', label: t('search.sortResort') },
  ];

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

      {records.length > 0 && (
        <>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t('search.placeholder')}
            placeholderTextColor={theme.textSecondary}
            style={[styles.searchInput, { color: theme.text, backgroundColor: theme.backgroundElement }]}
          />
          <View style={styles.sortRow}>
            {sortOptions.map((option) => (
              <Chip
                key={option.key}
                label={option.label}
                selected={sortKey === option.key}
                onPress={() => setSortKey(option.key)}
              />
            ))}
          </View>
        </>
      )}

      {records.length === 0 && (
        <ThemedText type="small" themeColor="textSecondary">
          {t('history.empty')}
        </ThemedText>
      )}

      <View style={styles.list}>
        {filteredRecords.map((record) => (
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
  searchInput: {
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  sortRow: {
    flexDirection: 'row',
    gap: Spacing.two,
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
