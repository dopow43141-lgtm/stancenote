import Constants from 'expo-constants';
import { useCallback, useMemo, useState } from 'react';
import { Linking, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';

import { AppHeader } from '@/components/stancenote/AppHeader';
import { ScreenScrollView } from '@/components/stancenote/ScreenScrollView';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { t } from '@/i18n';
import { useTheme } from '@/hooks/use-theme';
import {
  addBinding,
  addBoard,
  deleteBinding,
  deleteBoard,
  getBindings,
  getBoards,
} from '@/storage/boardsStorage';
import { BindingProfile, BoardProfile } from '@/types/board';

function BrandInput({
  value,
  onChangeText,
  brands,
  placeholder,
  style,
}: {
  value: string;
  onChangeText: (text: string) => void;
  brands: string[];
  placeholder: string;
  style: any;
}) {
  const theme = useTheme();
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filtered = useMemo(() => {
    if (!value.trim() || brands.length === 0) return [];
    const lower = value.toLowerCase();
    return brands.filter(
      (b) => b.toLowerCase().includes(lower) && b.toLowerCase() !== lower
    );
  }, [value, brands]);

  return (
    <View style={styles.brandInputWrapper}>
      <TextInput
        value={value}
        onChangeText={(text) => {
          onChangeText(text);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        style={style}
      />
      {showSuggestions && filtered.length > 0 && (
        <ThemedView type="backgroundElement" style={styles.suggestions}>
          {filtered.map((brand) => (
            <Pressable
              key={brand}
              onPress={() => {
                onChangeText(brand);
                setShowSuggestions(false);
              }}
              style={({ pressed }) => [
                styles.suggestionItem,
                pressed && { backgroundColor: theme.backgroundSelected },
              ]}>
              <ThemedText type="small">{brand}</ThemedText>
            </Pressable>
          ))}
        </ThemedView>
      )}
    </View>
  );
}

export default function MyPageScreen() {
  const theme = useTheme();
  const [boards, setBoards] = useState<BoardProfile[]>([]);
  const [bindings, setBindings] = useState<BindingProfile[]>([]);
  const [boardBrand, setBoardBrand] = useState('');
  const [boardModel, setBoardModel] = useState('');
  const [boardSize, setBoardSize] = useState('');
  const [bindingBrand, setBindingBrand] = useState('');
  const [bindingModel, setBindingModel] = useState('');

  const load = useCallback(() => {
    getBoards().then(setBoards);
    getBindings().then(setBindings);
  }, []);

  useFocusEffect(load);

  async function handleAddBoard() {
    if (!boardBrand.trim() || !boardModel.trim()) return;
    await addBoard({ brand: boardBrand.trim(), model: boardModel.trim(), size: boardSize.trim() || undefined });
    setBoardBrand('');
    setBoardModel('');
    setBoardSize('');
    load();
  }

  async function handleAddBinding() {
    if (!bindingBrand.trim() || !bindingModel.trim()) return;
    await addBinding({ brand: bindingBrand.trim(), model: bindingModel.trim() });
    setBindingBrand('');
    setBindingModel('');
    load();
  }

  const allBrands = useMemo(() => {
    const set = new Set<string>();
    boards.forEach((b) => set.add(b.brand));
    bindings.forEach((b) => set.add(b.brand));
    return [...set].sort();
  }, [boards, bindings]);

  const inputStyle = [styles.input, { color: theme.text, borderColor: theme.backgroundSelected }];

  return (
    <ScreenScrollView>
      <AppHeader />
      <ThemedText type="subtitle">{t('mypage.title')}</ThemedText>

      <Section title={t('mypage.myBoard')}>
        {boards.map((board) => (
          <ListRow
            key={board.id}
            label={`${board.brand} ${board.model}${board.size ? ` / ${board.size}` : ''}`}
            onDelete={() => deleteBoard(board.id).then(load)}
          />
        ))}
        <View style={styles.addRow}>
          <BrandInput
            value={boardBrand}
            onChangeText={setBoardBrand}
            brands={allBrands}
            placeholder={t('mypage.brand')}
            style={[inputStyle, styles.addInput]}
          />
          <TextInput
            value={boardModel}
            onChangeText={setBoardModel}
            placeholder={t('mypage.model')}
            placeholderTextColor={theme.textSecondary}
            style={[inputStyle, styles.addInput]}
          />
          <TextInput
            value={boardSize}
            onChangeText={setBoardSize}
            placeholder={t('mypage.size')}
            placeholderTextColor={theme.textSecondary}
            style={[inputStyle, styles.addInput]}
          />
        </View>
        <AddButton onPress={handleAddBoard} label={t('mypage.addBoard')} />
      </Section>

      <Section title={t('mypage.myBinding')}>
        {bindings.map((binding) => (
          <ListRow
            key={binding.id}
            label={`${binding.brand} ${binding.model}`}
            onDelete={() => deleteBinding(binding.id).then(load)}
          />
        ))}
        <View style={styles.addRow}>
          <BrandInput
            value={bindingBrand}
            onChangeText={setBindingBrand}
            brands={allBrands}
            placeholder={t('mypage.brand')}
            style={[inputStyle, styles.addInput]}
          />
          <TextInput
            value={bindingModel}
            onChangeText={setBindingModel}
            placeholder={t('mypage.model')}
            placeholderTextColor={theme.textSecondary}
            style={[inputStyle, styles.addInput]}
          />
        </View>
        <AddButton onPress={handleAddBinding} label={t('mypage.addBinding')} />
      </Section>

      <Section title={t('mypage.support')}>
        <Pressable onPress={() => router.push('/terms')} style={({ pressed }) => pressed && styles.pressed}>
          <ThemedView type="backgroundElement" style={styles.linkButton}>
            <ThemedText type="small">{t('mypage.terms')}</ThemedText>
          </ThemedView>
        </Pressable>
        <Pressable onPress={() => router.push('/privacy')} style={({ pressed }) => pressed && styles.pressed}>
          <ThemedView type="backgroundElement" style={styles.linkButton}>
            <ThemedText type="small">{t('mypage.privacy')}</ThemedText>
          </ThemedView>
        </Pressable>
        <Pressable
          onPress={() => {
            Linking.openURL('https://docs.google.com/forms/d/1UcwurVEIchVdZlY9V_F9nA82ESWgY98G1_hImag6CHg/viewform');
          }}
          style={({ pressed }) => pressed && styles.pressed}>
          <ThemedView type="backgroundElement" style={styles.linkButton}>
            <ThemedText type="small">{t('mypage.contact')}</ThemedText>
          </ThemedView>
        </Pressable>
      </Section>

      <Section title={t('mypage.about')}>
        <ThemedText type="small" themeColor="textSecondary">
          StanceNote v{Constants.expoConfig?.version ?? '1.0.0'}
        </ThemedText>
      </Section>
    </ScreenScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <ThemedText type="smallBold">{title}</ThemedText>
      {children}
    </View>
  );
}

function ListRow({ label, onDelete }: { label: string; onDelete: () => void }) {
  return (
    <View style={styles.listRow}>
      <ThemedText type="small">{label}</ThemedText>
      <Pressable onPress={onDelete} style={({ pressed }) => pressed && styles.pressed}>
        <ThemedText type="small" themeColor="textSecondary">
          {t('mypage.delete')}
        </ThemedText>
      </Pressable>
    </View>
  );
}

function AddButton({ onPress, label }: { onPress: () => void; label: string }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView type="backgroundElement" style={styles.addButton}>
        <ThemedText type="small">{label}</ThemedText>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.two,
  },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.one,
  },
  addRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    flexWrap: 'wrap',
  },
  addInput: {
    flex: 1,
    minWidth: 80,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 14,
  },
  addButton: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
  },
  linkButton: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
    alignSelf: 'flex-start',
  },
  pressed: {
    opacity: 0.7,
  },
  brandInputWrapper: {
    flex: 1,
    minWidth: 80,
    zIndex: 1,
  },
  suggestions: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    borderRadius: Spacing.two,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  suggestionItem: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
});
