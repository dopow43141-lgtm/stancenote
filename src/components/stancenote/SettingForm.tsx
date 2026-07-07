import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { BoardDiagram, BoardDiagramValue } from './BoardDiagram';
import { Chip } from './Chip';
import { StarRating } from './StarRating';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { t } from '@/i18n';
import { useTheme } from '@/hooks/use-theme';
import { BindingProfile, BoardProfile } from '@/types/board';
import { RIDING_STYLES, ridingStyleLabel, RidingStyle, SettingRecord, SettingRecordInput } from '@/types/setting';

export function SettingForm({
  initialValue,
  boards,
  bindings,
  submitLabel,
  onSubmit,
}: {
  initialValue?: SettingRecord;
  boards: BoardProfile[];
  bindings: BindingProfile[];
  submitLabel: string;
  onSubmit: (input: SettingRecordInput) => Promise<void>;
}) {
  const theme = useTheme();

  const [diagramValue, setDiagramValue] = useState<BoardDiagramValue>({
    stanceWidthCm: initialValue?.stanceWidthCm ?? 46,
    setbackCm: initialValue?.setbackCm ?? 0,
    frontAngleDeg: initialValue?.frontAngleDeg ?? 15,
    rearAngleDeg: initialValue?.rearAngleDeg ?? -9,
    stance: initialValue?.stance ?? 'レギュラー',
  });
  const [ridingStyles, setRidingStyles] = useState<RidingStyle[]>(
    initialValue?.ridingStyle ?? []
  );
  const [memo, setMemo] = useState(initialValue?.memo ?? '');
  const [boardBrand, setBoardBrand] = useState(initialValue?.boardBrand ?? '');
  const [boardModel, setBoardModel] = useState(initialValue?.boardModel ?? '');
  const [boardSize, setBoardSize] = useState(initialValue?.boardSize ?? '');
  const [bindingBrand, setBindingBrand] = useState(initialValue?.bindingBrand ?? '');
  const [bindingModel, setBindingModel] = useState(initialValue?.bindingModel ?? '');
  const [mediaUris, setMediaUris] = useState<string[]>(
    initialValue?.mediaUris ?? (initialValue?.photoUri ? [initialValue.photoUri] : [])
  );
  const [review, setReview] = useState<number | undefined>(initialValue?.review);
  const [resort, setResort] = useState(initialValue?.resort ?? '');
  const [snowCondition, setSnowCondition] = useState(initialValue?.snowCondition ?? '');
  const [error, setError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  async function pickMedia() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      quality: 0.7,
      allowsMultipleSelection: true,
    });
    if (!result.canceled && result.assets.length > 0) {
      setMediaUris((prev) => [...prev, ...result.assets.map((a) => a.uri)]);
    }
  }

  function selectBoard(board: BoardProfile) {
    setBoardBrand(board.brand);
    setBoardModel(board.model);
    setBoardSize(board.size ?? '');
  }

  function selectBinding(binding: BindingProfile) {
    setBindingBrand(binding.brand);
    setBindingModel(binding.model);
  }

  async function handleSubmit() {
    if (ridingStyles.length === 0) {
      setError(t('form.ridingStyleError'));
      return;
    }
    if (!memo.trim()) {
      setError(t('form.memoError'));
      return;
    }

    setError(undefined);
    setSubmitting(true);
    try {
      await onSubmit({
        stanceWidthCm: diagramValue.stanceWidthCm,
        frontAngleDeg: diagramValue.frontAngleDeg,
        rearAngleDeg: diagramValue.rearAngleDeg,
        setbackCm: diagramValue.setbackCm,
        stance: diagramValue.stance,
        ridingStyle: ridingStyles,
        memo: memo.trim(),
        boardBrand: boardBrand.trim() || undefined,
        boardModel: boardModel.trim() || undefined,
        boardSize: boardSize.trim() || undefined,
        bindingBrand: bindingBrand.trim() || undefined,
        bindingModel: bindingModel.trim() || undefined,
        photoUri: mediaUris[0],
        mediaUris: mediaUris.length > 0 ? mediaUris : undefined,
        review,
        resort: resort.trim() || undefined,
        snowCondition: snowCondition.trim() || undefined,
      });
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle = [styles.input, { color: theme.text, borderColor: theme.backgroundSelected }];

  return (
    <View style={styles.form}>
      <BoardDiagram value={diagramValue} onChange={setDiagramValue} />

      <Field label={t('form.ridingStyle')} required>
        <View style={styles.chipRow}>
          {RIDING_STYLES.map((style) => (
            <Chip
              key={style}
              label={ridingStyleLabel(style)}
              selected={ridingStyles.includes(style)}
              onPress={() =>
                setRidingStyles((prev) =>
                  prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
                )
              }
            />
          ))}
        </View>
      </Field>

      <Field label={t('form.reviewLabel')} required>
        <TextInput
          value={memo}
          onChangeText={setMemo}
          placeholder={t('form.memoPlaceholder')}
          placeholderTextColor={theme.textSecondary}
          multiline
          numberOfLines={3}
          style={[inputStyle, styles.multiline]}
        />
      </Field>

      <ThemedText type="smallBold" style={styles.sectionTitle}>
        {t('form.optional')}
      </ThemedText>

      <Field label={t('form.board')}>
        {boards.length > 0 && (
          <View style={styles.chipRow}>
            {boards.map((board) => (
              <Chip
                key={board.id}
                label={`${board.brand} ${board.model}`}
                selected={boardBrand === board.brand && boardModel === board.model}
                onPress={() => selectBoard(board)}
              />
            ))}
          </View>
        )}
        <TextInput
          value={boardBrand}
          onChangeText={setBoardBrand}
          placeholder={t('form.brand')}
          placeholderTextColor={theme.textSecondary}
          style={inputStyle}
        />
        <TextInput
          value={boardModel}
          onChangeText={setBoardModel}
          placeholder={t('form.model')}
          placeholderTextColor={theme.textSecondary}
          style={inputStyle}
        />
        <TextInput
          value={boardSize}
          onChangeText={setBoardSize}
          placeholder={t('form.size')}
          placeholderTextColor={theme.textSecondary}
          style={inputStyle}
        />
      </Field>

      <Field label={t('form.binding')}>
        {bindings.length > 0 && (
          <View style={styles.chipRow}>
            {bindings.map((binding) => (
              <Chip
                key={binding.id}
                label={`${binding.brand} ${binding.model}`}
                selected={bindingBrand === binding.brand && bindingModel === binding.model}
                onPress={() => selectBinding(binding)}
              />
            ))}
          </View>
        )}
        <TextInput
          value={bindingBrand}
          onChangeText={setBindingBrand}
          placeholder={t('form.brand')}
          placeholderTextColor={theme.textSecondary}
          style={inputStyle}
        />
        <TextInput
          value={bindingModel}
          onChangeText={setBindingModel}
          placeholder={t('form.model')}
          placeholderTextColor={theme.textSecondary}
          style={inputStyle}
        />
      </Field>

      <Field label={t('form.media')}>
        <View style={styles.mediaGrid}>
          {mediaUris.map((uri, index) => {
            const isVideo = /\.(mov|mp4|avi|m4v)$/i.test(uri) || uri.includes('video');
            return (
              <View key={uri} style={styles.mediaThumbnail}>
                {isVideo ? (
                  <View style={[styles.mediaImage, styles.videoPlaceholder]}>
                    <ThemedText type="small" style={{ color: '#FFFFFF' }}>▶</ThemedText>
                  </View>
                ) : (
                  <Image source={{ uri }} style={styles.mediaImage} />
                )}
                <Pressable
                  onPress={() => setMediaUris((prev) => prev.filter((_, i) => i !== index))}
                  style={styles.mediaRemove}>
                  <ThemedText type="small" style={styles.mediaRemoveText}>✕</ThemedText>
                </Pressable>
              </View>
            );
          })}
        </View>
        <Pressable onPress={pickMedia} style={({ pressed }) => pressed && styles.pressed}>
          <ThemedView type="backgroundElement" style={styles.photoButton}>
            <ThemedText type="small">{t('form.addMedia')}</ThemedText>
          </ThemedView>
        </Pressable>
      </Field>

      <Field label={t('form.ratingLabel')}>
        <StarRating value={review} onChange={setReview} />
      </Field>

      <View style={styles.row}>
        <View style={styles.half}>
          <Field label={t('form.resort')}>
            <TextInput
              value={resort}
              onChangeText={setResort}
              placeholder={t('form.resortPlaceholder')}
              placeholderTextColor={theme.textSecondary}
              style={inputStyle}
            />
          </Field>
        </View>
        <View style={styles.half}>
          <Field label={t('form.snowCondition')}>
            <TextInput
              value={snowCondition}
              onChangeText={setSnowCondition}
              placeholder={t('form.snowPlaceholder')}
              placeholderTextColor={theme.textSecondary}
              style={inputStyle}
            />
          </Field>
        </View>
      </View>

      {error && (
        <ThemedText type="small" themeColor="text" style={styles.error}>
          {error}
        </ThemedText>
      )}

      <Pressable
        onPress={handleSubmit}
        disabled={submitting}
        style={({ pressed }) => pressed && styles.pressed}>
        <View style={[styles.submitButton, { opacity: submitting ? 0.6 : 1 }]}>
          <ThemedText type="smallBold" themeColor="background">
            {submitting ? t('form.saving') : submitLabel}
          </ThemedText>
        </View>
      </Pressable>
    </View>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.field}>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
        {required ? ' *' : ''}
      </ThemedText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.four,
  },
  field: {
    gap: Spacing.one,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  half: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  sectionTitle: {
    marginTop: Spacing.two,
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  mediaThumbnail: {
    position: 'relative',
    width: 72,
    height: 72,
    borderRadius: Spacing.two,
    overflow: 'hidden',
  },
  mediaImage: {
    width: 72,
    height: 72,
  },
  mediaRemove: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaRemoveText: {
    color: '#FFFFFF',
    fontSize: 11,
    lineHeight: 20,
  },
  videoPlaceholder: {
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoButton: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
  },
  pressed: {
    opacity: 0.7,
  },
  error: {
    color: '#D64545',
  },
  submitButton: {
    backgroundColor: '#208AEF',
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
});
