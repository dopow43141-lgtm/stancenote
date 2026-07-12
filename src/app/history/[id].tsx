import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, Share, StyleSheet, View } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';

import { MediaViewer } from '@/components/stancenote/MediaViewer';
import { ScreenScrollView } from '@/components/stancenote/ScreenScrollView';
import { SettingForm } from '@/components/stancenote/SettingForm';
import { StarRating } from '@/components/stancenote/StarRating';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { t } from '@/i18n';
import { getBindings, getBoards } from '@/storage/boardsStorage';
import {
  deleteSettingRecord,
  getSettingRecord,
  updateSettingRecord,
} from '@/storage/settingsStorage';
import { BindingProfile, BoardProfile } from '@/types/board';
import { ridingStyleLabel, stanceTypeLabel } from '@/types/setting';
import { SettingRecord } from '@/types/setting';

export default function RecordDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [record, setRecord] = useState<SettingRecord | undefined>();
  const [boards, setBoards] = useState<BoardProfile[]>([]);
  const [bindings, setBindings] = useState<BindingProfile[]>([]);
  const [editing, setEditing] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(-1);

  useFocusEffect(
    useCallback(() => {
      getSettingRecord(id).then(setRecord);
      getBoards().then(setBoards);
      getBindings().then(setBindings);
    }, [id])
  );

  if (!record) {
    return (
      <ScreenScrollView includeTabBarInset={false}>
        <ThemedText type="small" themeColor="textSecondary">
          {t('detail.loading')}
        </ThemedText>
      </ScreenScrollView>
    );
  }

  function handleShare() {
    if (!record) return;
    const styleDisplay = Array.isArray(record.ridingStyle)
      ? record.ridingStyle.map(ridingStyleLabel).join('・')
      : ridingStyleLabel(record.ridingStyle);
    const lines = [
      t('detail.shareTitle', { style: styleDisplay }),
      t('detail.stanceWidth', { width: record.stanceWidthCm }),
      t('detail.angles', { front: record.frontAngleDeg, rear: record.rearAngleDeg }),
      [record.boardBrand, record.boardModel].filter(Boolean).join(' ') || undefined,
      record.memo ? t('detail.memo', { text: record.memo }) : undefined,
    ].filter((line): line is string => Boolean(line));
    Share.share({ message: lines.join('\n') });
  }

  function handleDelete() {
    if (!record) return;
    Alert.alert(t('detail.deleteTitle'), t('detail.deleteMessage'), [
      { text: t('detail.deleteCancel'), style: 'cancel' },
      {
        text: t('detail.deleteConfirm'),
        style: 'destructive',
        onPress: async () => {
          await deleteSettingRecord(record.id);
          router.back();
        },
      },
    ]);
  }

  if (editing) {
    return (
      <ScreenScrollView includeTabBarInset={false}>
        <SettingForm
          initialValue={record}
          boards={boards}
          bindings={bindings}
          submitLabel={t('detail.update')}
          onSubmit={async (input) => {
            await updateSettingRecord(record.id, input);
            setEditing(false);
            getSettingRecord(record.id).then(setRecord);
          }}
        />
      </ScreenScrollView>
    );
  }

  const boardLabel = [record.boardBrand, record.boardModel, record.boardSize]
    .filter(Boolean)
    .join(' ');
  const bindingLabel = [record.bindingBrand, record.bindingModel].filter(Boolean).join(' ');
  const date = new Date(record.createdAt);
  const allMedia = record.mediaUris ?? (record.photoUri ? [record.photoUri] : []);

  return (
    <ScreenScrollView includeTabBarInset={false}>
      <View style={styles.headerRow}>
        <View style={styles.headerTitle}>
          <ThemedText type="subtitle">{record.title || t('card.noTitle')}</ThemedText>
        </View>
        <ThemedText type="small" themeColor="textSecondary">
          {date.toLocaleDateString('ja-JP')}
        </ThemedText>
      </View>

      {allMedia.length > 0 && (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaScroll}>
            {allMedia.map((uri, index) => {
              const isVideo = /\.(mov|mp4|avi|m4v)$/i.test(uri) || uri.includes('video');
              return (
                <Pressable key={uri} onPress={() => setViewerIndex(index)}>
                  {isVideo ? (
                    <VideoThumbnail uri={uri} />
                  ) : (
                    <Image source={{ uri }} style={styles.mediaItem} />
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
          <MediaViewer
            uris={allMedia}
            initialIndex={viewerIndex >= 0 ? viewerIndex : 0}
            visible={viewerIndex >= 0}
            onClose={() => setViewerIndex(-1)}
          />
        </>
      )}

      <DetailRow label={t('detail.stance')} value={stanceTypeLabel(record.stance)} />
      <DetailRow label={t('detail.stanceWidthLabel')} value={`${record.stanceWidthCm} cm`} />
      <DetailRow label={t('detail.frontAngle')} value={`${record.frontAngleDeg}°`} />
      <DetailRow label={t('detail.rearAngle')} value={`${record.rearAngleDeg}°`} />
      <DetailRow
        label={t('detail.setPosition')}
        value={
          record.setbackCm > 0
            ? t('detail.setback', { cm: record.setbackCm })
            : record.setbackCm < 0
              ? t('detail.setfront', { cm: Math.abs(record.setbackCm) })
              : t('detail.center')
        }
      />
      {boardLabel !== '' && <DetailRow label={t('detail.board')} value={boardLabel} />}
      {bindingLabel !== '' && <DetailRow label={t('detail.binding')} value={bindingLabel} />}
      {record.resort && <DetailRow label={t('detail.resort')} value={record.resort} />}
      {record.snowCondition && <DetailRow label={t('detail.snowCondition')} value={record.snowCondition} />}
      {record.review && (
        <View style={styles.reviewRow}>
          <ThemedText type="small" themeColor="textSecondary">
            {t('detail.review')}
          </ThemedText>
          <StarRating value={record.review} size={18} readonly />
        </View>
      )}
      <View style={styles.memoBlock}>
        <ThemedText type="small" themeColor="textSecondary">
          {t('detail.memoLabel')}
        </ThemedText>
        <ThemedText type="small">{record.memo}</ThemedText>
      </View>

      <View style={styles.actionsRow}>
        <ActionButton label={t('detail.share')} onPress={handleShare} />
        <ActionButton label={t('detail.edit')} onPress={() => setEditing(true)} />
        <ActionButton label={t('detail.delete')} onPress={handleDelete} destructive />
      </View>
    </ScreenScrollView>
  );
}

function VideoThumbnail({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri);
  return (
    <View pointerEvents="none">
      <VideoView player={player} style={styles.mediaItem} nativeControls={false} />
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
      <ThemedText type="small">{value}</ThemedText>
    </View>
  );
}

function ActionButton({
  label,
  onPress,
  destructive,
}: {
  label: string;
  onPress: () => void;
  destructive?: boolean;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView type="backgroundElement" style={styles.actionButton}>
        <ThemedText type="small" style={destructive ? styles.destructiveText : undefined}>
          {label}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  headerTitle: {
    flex: 1,
  },
  mediaScroll: {
    marginHorizontal: -Spacing.four,
    paddingHorizontal: Spacing.four,
  },
  mediaItem: {
    width: 200,
    height: 150,
    borderRadius: Spacing.two,
    marginRight: Spacing.two,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memoBlock: {
    gap: Spacing.one,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.three,
    flexWrap: 'wrap',
  },
  actionButton: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
  },
  pressed: {
    opacity: 0.7,
  },
  destructiveText: {
    color: '#D64545',
  },
});
