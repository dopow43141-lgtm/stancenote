import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { t } from '@/i18n';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Slide = {
  icon: string;
  title: string;
  description: string;
};

const slides: Slide[] = [
  {
    icon: '🏂',
    title: 'onboarding.welcomeTitle',
    description: 'onboarding.welcomeDesc',
  },
  {
    icon: '📋',
    title: 'onboarding.registerTitle',
    description: 'onboarding.registerDesc',
  },
  {
    icon: '📐',
    title: 'onboarding.recordTitle',
    description: 'onboarding.recordDesc',
  },
  {
    icon: '🚀',
    title: 'onboarding.startTitle',
    description: 'onboarding.startDesc',
  },
];

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const isLast = currentIndex === slides.length - 1;

  function handleNext() {
    if (isLast) {
      onComplete();
    } else {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    }
  }

  function handleSkip() {
    onComplete();
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.skipRow}>
        {!isLast && (
          <Pressable onPress={handleSkip} hitSlop={12}>
            <ThemedText type="small" themeColor="textSecondary">
              {t('onboarding.skip')}
            </ThemedText>
          </Pressable>
        )}
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Text style={styles.icon}>{item.icon}</Text>
            <ThemedText type="subtitle" style={styles.title}>
              {t(item.title)}
            </ThemedText>
            <ThemedText type="default" themeColor="textSecondary" style={styles.description}>
              {t(item.description)}
            </ThemedText>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === currentIndex && styles.dotActive]}
            />
          ))}
        </View>

        <Pressable
          onPress={handleNext}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <ThemedText type="smallBold" style={styles.buttonText}>
            {isLast ? t('onboarding.getStarted') : t('onboarding.next')}
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipRow: {
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.four,
    height: 44,
    justifyContent: 'center',
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.five,
  },
  icon: {
    fontSize: 120,
    marginBottom: Spacing.four,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.three,
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    gap: Spacing.four,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C0C0C0',
  },
  dotActive: {
    backgroundColor: '#208AEF',
    width: 24,
  },
  button: {
    backgroundColor: '#208AEF',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
