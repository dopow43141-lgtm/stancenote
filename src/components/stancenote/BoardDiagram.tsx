import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Svg, { Path, Polygon, Rect } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { t } from '@/i18n';
import { useTheme } from '@/hooks/use-theme';
import { stanceTypeLabel, StanceType } from '@/types/setting';

type InputMode = 'drag' | 'button';

const PX_PER_CM = 2.775;
const DRAG_DAMPING = 0.4;
const BOARD_WIDTH = 100;
const BOARD_HEIGHT = 380;
const CENTER_Y = BOARD_HEIGHT / 2;
const MIN_STANCE_CM = 40;
const MAX_STANCE_CM = 60;
const TRAVEL_LIMIT_CM = 44;
const BINDING_WIDTH = 58;
const BINDING_HEIGHT = 24;
const MAX_ANGLE = 60;
const SIDE_COLUMN_WIDTH = 100;
const DIAL_COLUMN_WIDTH = SIDE_COLUMN_WIDTH;
const DIAL_SIZE = 80;
const SETBACK_STEP_CM = 0.5;
const SETBACK_HANDLE_WIDTH = 40;
const SETBACK_HANDLE_HEIGHT = 14;

export type BoardDiagramValue = {
  stanceWidthCm: number;
  setbackCm: number;
  frontAngleDeg: number;
  rearAngleDeg: number;
  stance: StanceType;
};

function snowboardPath() {
  const cx = BOARD_WIDTH / 2;
  const w = BOARD_WIDTH / 2 - 2;
  const h = BOARD_HEIGHT;
  const noseRound = 22;
  const noseShoulder = h * 0.14;
  const tailShoulder = h * 0.86;
  const tailRound = 26;

  return `
    M ${cx} 0
    C ${cx + w * 0.55} 0 ${cx + w} ${noseRound} ${cx + w} ${noseShoulder}
    L ${cx + w} ${tailShoulder}
    C ${cx + w} ${h - tailRound} ${cx + w * 0.55} ${h} ${cx} ${h}
    C ${cx - w * 0.55} ${h} ${cx - w} ${h - tailRound} ${cx - w} ${tailShoulder}
    L ${cx - w} ${noseShoulder}
    C ${cx - w} ${noseRound} ${cx - w * 0.55} 0 ${cx} 0
    Z
  `;
}

/** Shoe-sole silhouette: narrow rounded heel on the left, wide rounded toe on the right. */
function solePath(w: number, h: number) {
  const cy = h / 2;
  return `
    M 0 ${cy}
    C 0 ${cy - h * 0.3} ${w * 0.15} 0 ${w * 0.35} 0
    L ${w * 0.7} 0
    C ${w * 0.9} 0 ${w} ${cy - h * 0.25} ${w} ${cy}
    C ${w} ${cy + h * 0.25} ${w * 0.9} ${h} ${w * 0.7} ${h}
    L ${w * 0.35} ${h}
    C ${w * 0.15} ${h} 0 ${cy + h * 0.3} 0 ${cy}
    Z
  `;
}

function roundTo(value: number, step: number) {
  return Math.round(value / step) * step;
}

export function BoardDiagram({
  value,
  onChange,
}: {
  value: BoardDiagramValue;
  onChange: (value: BoardDiagramValue) => void;
}) {
  const theme = useTheme();
  const [inputMode, setInputMode] = useState<InputMode>('drag');
  const isGoofy = value.stance === 'グーフィー';
  const mirrorX = isGoofy ? -1 : 1;

  const vFront = useSharedValue(value.setbackCm - value.stanceWidthCm / 2);
  const vRear = useSharedValue(value.setbackCm + value.stanceWidthCm / 2);
  // Internal angle drives the visual rotation (CSS clockwise-positive, 0deg =
  // toe pointing right). The displayed/stored angle is its negation, so that
  // a positive value means the toe is rotated toward the nose (the riders'
  // convention), matching the sole shape's toe-right/heel-left base orientation.
  const frontAngle = useSharedValue(-value.frontAngleDeg);
  const rearAngle = useSharedValue(-value.rearAngleDeg);

  const frontStartV = useSharedValue(0);
  const rearStartV = useSharedValue(0);
  const frontAngleStart = useSharedValue(0);
  const rearAngleStart = useSharedValue(0);
  const frontLastAngle = useSharedValue(0);
  const rearLastAngle = useSharedValue(0);

  function commit() {
    const stanceWidthCm = Math.round(vRear.value - vFront.value);
    const setbackCm = roundTo((vFront.value + vRear.value) / 2, SETBACK_STEP_CM);
    onChange({
      ...value,
      stanceWidthCm,
      setbackCm,
      frontAngleDeg: Math.round(-frontAngle.value),
      rearAngleDeg: Math.round(-rearAngle.value),
    });
  }

  // Angles keep their value across the toggle (positive still means
  // toe-toward-nose); only the mirrored visuals change.
  function toggleStance() {
    onChange({
      ...value,
      stance: value.stance === 'レギュラー' ? 'グーフィー' : 'レギュラー',
    });
  }

  // Dragging a binding stretches/narrows the stance symmetrically, keeping the
  // setback (midpoint) fixed.
  const frontPan = Gesture.Pan()
    .onStart(() => {
      frontStartV.value = vFront.value;
      rearStartV.value = vRear.value;
    })
    .onUpdate((e) => {
      const delta = (e.translationY * DRAG_DAMPING) / PX_PER_CM;
      const width = rearStartV.value - frontStartV.value - 2 * delta;
      const clampedWidth = Math.min(Math.max(width, MIN_STANCE_CM), MAX_STANCE_CM);
      const halfDelta = (rearStartV.value - frontStartV.value - clampedWidth) / 2;
      vFront.value = Math.max(frontStartV.value + halfDelta, -TRAVEL_LIMIT_CM);
      vRear.value = Math.min(rearStartV.value - halfDelta, TRAVEL_LIMIT_CM);
      runOnJS(commit)();
    });

  const rearPan = Gesture.Pan()
    .onStart(() => {
      frontStartV.value = vFront.value;
      rearStartV.value = vRear.value;
    })
    .onUpdate((e) => {
      const delta = (e.translationY * DRAG_DAMPING) / PX_PER_CM;
      const width = rearStartV.value - frontStartV.value + 2 * delta;
      const clampedWidth = Math.min(Math.max(width, MIN_STANCE_CM), MAX_STANCE_CM);
      const halfDelta = (clampedWidth - (rearStartV.value - frontStartV.value)) / 2;
      vFront.value = Math.max(frontStartV.value - halfDelta, -TRAVEL_LIMIT_CM);
      vRear.value = Math.min(rearStartV.value + halfDelta, TRAVEL_LIMIT_CM);
      runOnJS(commit)();
    });

  const setbackPan = Gesture.Pan()
    .onStart(() => {
      frontStartV.value = vFront.value;
      rearStartV.value = vRear.value;
    })
    .onUpdate((e) => {
      const delta = (e.translationY * DRAG_DAMPING) / PX_PER_CM;
      const maxDelta = TRAVEL_LIMIT_CM - rearStartV.value;
      const minDelta = -TRAVEL_LIMIT_CM - frontStartV.value;
      const clampedDelta = Math.min(Math.max(delta, minDelta), maxDelta);
      vFront.value = frontStartV.value + clampedDelta;
      vRear.value = rearStartV.value + clampedDelta;
      runOnJS(commit)();
    });

  const frontRotate = Gesture.Pan()
    .onStart((e) => {
      frontAngleStart.value = frontAngle.value;
      const dx = (e.x - DIAL_SIZE / 2) * mirrorX;
      const dy = e.y - DIAL_SIZE / 2;
      frontLastAngle.value = (Math.atan2(dy, dx) * 180) / Math.PI;
    })
    .onUpdate((e) => {
      const dx = (e.x - DIAL_SIZE / 2) * mirrorX;
      const dy = e.y - DIAL_SIZE / 2;
      const touchAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
      let delta = touchAngle - frontLastAngle.value;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      frontLastAngle.value = touchAngle;
      const next = frontAngleStart.value + delta;
      frontAngle.value = Math.min(Math.max(next, -MAX_ANGLE), MAX_ANGLE);
      frontAngleStart.value = frontAngle.value;
      runOnJS(commit)();
    });

  const rearRotate = Gesture.Pan()
    .onStart((e) => {
      rearAngleStart.value = rearAngle.value;
      const dx = (e.x - DIAL_SIZE / 2) * mirrorX;
      const dy = e.y - DIAL_SIZE / 2;
      rearLastAngle.value = (Math.atan2(dy, dx) * 180) / Math.PI;
    })
    .onUpdate((e) => {
      const dx = (e.x - DIAL_SIZE / 2) * mirrorX;
      const dy = e.y - DIAL_SIZE / 2;
      const touchAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
      let delta = touchAngle - rearLastAngle.value;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      rearLastAngle.value = touchAngle;
      const next = rearAngleStart.value + delta;
      rearAngle.value = Math.min(Math.max(next, -MAX_ANGLE), MAX_ANGLE);
      rearAngleStart.value = rearAngle.value;
      runOnJS(commit)();
    });

  const frontRowStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: CENTER_Y + vFront.value * PX_PER_CM - BINDING_HEIGHT / 2 }],
  }));
  const rearRowStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: CENTER_Y + vRear.value * PX_PER_CM - BINDING_HEIGHT / 2 }],
  }));
  const frontBindingStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: mirrorX }, { rotate: `${frontAngle.value}deg` }],
  }));
  const rearBindingStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: mirrorX }, { rotate: `${rearAngle.value}deg` }],
  }));
  const setbackRowStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY:
          CENTER_Y + ((vFront.value + vRear.value) / 2) * PX_PER_CM - SETBACK_HANDLE_HEIGHT / 2,
      },
    ],
  }));
  const frontDialRowStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: CENTER_Y + vFront.value * PX_PER_CM - DIAL_SIZE / 2 }],
  }));
  const rearDialRowStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: CENTER_Y + vRear.value * PX_PER_CM - DIAL_SIZE / 2 }],
  }));
  const frontDialStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: mirrorX }, { rotate: `${frontAngle.value}deg` }],
  }));
  const rearDialStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: mirrorX }, { rotate: `${rearAngle.value}deg` }],
  }));

  function adjustStanceWidth(delta: number) {
    const newWidth = Math.min(Math.max(value.stanceWidthCm + delta, MIN_STANCE_CM), MAX_STANCE_CM);
    onChange({ ...value, stanceWidthCm: newWidth });
    const half = newWidth / 2;
    vFront.value = value.setbackCm - half;
    vRear.value = value.setbackCm + half;
  }

  function adjustSetback(delta: number) {
    const half = value.stanceWidthCm / 2;
    const newSetback = roundTo(value.setbackCm + delta, SETBACK_STEP_CM);
    const front = newSetback - half;
    const rear = newSetback + half;
    if (front < -TRAVEL_LIMIT_CM || rear > TRAVEL_LIMIT_CM) return;
    onChange({ ...value, setbackCm: newSetback });
    vFront.value = front;
    vRear.value = rear;
  }

  function adjustFrontAngle(delta: number) {
    const newAngle = Math.min(Math.max(value.frontAngleDeg + delta, -MAX_ANGLE), MAX_ANGLE);
    onChange({ ...value, frontAngleDeg: newAngle });
    frontAngle.value = -newAngle;
  }

  function adjustRearAngle(delta: number) {
    const newAngle = Math.min(Math.max(value.rearAngleDeg + delta, -MAX_ANGLE), MAX_ANGLE);
    onChange({ ...value, rearAngleDeg: newAngle });
    rearAngle.value = -newAngle;
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.diagramRow}>
        <View style={styles.leftColumn}>
          <Pressable onPress={toggleStance} style={({ pressed }) => pressed && styles.pressed}>
            <ThemedView type="backgroundElement" style={styles.toggleButton}>
              <ThemedText type="small" numberOfLines={1}>
                {stanceTypeLabel(value.stance)}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">↕</ThemedText>
            </ThemedView>
          </Pressable>
        </View>

        <View style={styles.board}>
          <Svg width={BOARD_WIDTH} height={BOARD_HEIGHT} style={StyleSheet.absoluteFill}>
            <Path
              d={snowboardPath()}
              fill={theme.backgroundElement}
              stroke={theme.backgroundSelected}
              strokeWidth={1}
            />
          </Svg>

          <Animated.View style={[styles.bindingRow, frontRowStyle]} pointerEvents="box-none">
            {inputMode === 'drag' ? (
              <GestureDetector gesture={frontPan}>
                <View style={styles.binding} />
              </GestureDetector>
            ) : (
              <View style={styles.binding} />
            )}
            <Animated.View
              style={[styles.binding, styles.bindingVisual, frontBindingStyle]}
              pointerEvents="none">
              <Svg width={BINDING_WIDTH} height={BINDING_HEIGHT}>
                <Path d={solePath(BINDING_WIDTH, BINDING_HEIGHT)} fill="#208AEF" />
              </Svg>
            </Animated.View>
          </Animated.View>

          <Animated.View style={[styles.bindingRow, rearRowStyle]} pointerEvents="box-none">
            {inputMode === 'drag' ? (
              <GestureDetector gesture={rearPan}>
                <View style={styles.binding} />
              </GestureDetector>
            ) : (
              <View style={styles.binding} />
            )}
            <Animated.View
              style={[styles.binding, styles.bindingVisual, rearBindingStyle]}
              pointerEvents="none">
              <Svg width={BINDING_WIDTH} height={BINDING_HEIGHT}>
                <Path d={solePath(BINDING_WIDTH, BINDING_HEIGHT)} fill="#F5A623" />
              </Svg>
            </Animated.View>
          </Animated.View>

          <Animated.View style={[styles.setbackRow, setbackRowStyle]}>
            {inputMode === 'drag' ? (
              <GestureDetector gesture={setbackPan}>
                <View
                  style={[styles.setbackHandle, { backgroundColor: theme.text, opacity: 0.4 }]}
                />
              </GestureDetector>
            ) : (
              <View
                style={[styles.setbackHandle, { backgroundColor: theme.text, opacity: 0.2 }]}
              />
            )}
          </Animated.View>
        </View>

        <View style={styles.rightColumn}>
          <Pressable
            onPress={() => setInputMode(inputMode === 'drag' ? 'button' : 'drag')}
            style={({ pressed }) => pressed && styles.pressed}>
            <ThemedView type="backgroundElement" style={styles.toggleButton}>
              <ThemedText type="small" numberOfLines={1}>
                {inputMode === 'drag' ? t('diagram.modeDrag') : t('diagram.modeButton')}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">↕</ThemedText>
            </ThemedView>
          </Pressable>

          {inputMode === 'drag' && (
            <>
              <Animated.View style={[styles.dialRow, frontDialRowStyle]}>
                <GestureDetector gesture={frontRotate}>
                  <View
                    style={[
                      styles.dialTouchArea,
                      { backgroundColor: theme.backgroundElement, borderColor: '#208AEF' },
                    ]}>
                    <Animated.View style={[styles.dialTick, frontDialStyle]}>
                      <ArrowNeedle color="#208AEF" />
                    </Animated.View>
                  </View>
                </GestureDetector>
              </Animated.View>

              <Animated.View style={[styles.dialRow, rearDialRowStyle]}>
                <GestureDetector gesture={rearRotate}>
                  <View
                    style={[
                      styles.dialTouchArea,
                      { backgroundColor: theme.backgroundElement, borderColor: '#F5A623' },
                    ]}>
                    <Animated.View style={[styles.dialTick, rearDialStyle]}>
                      <ArrowNeedle color="#F5A623" />
                    </Animated.View>
                  </View>
                </GestureDetector>
              </Animated.View>
            </>
          )}
        </View>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendRow}>
          <LegendDot color="#208AEF" label={t('diagram.frontFoot')} />
          <LegendDot color="#F5A623" label={t('diagram.rearFoot')} />
        </View>
      </View>

      <ReadoutText value={value} />

      {inputMode === 'button' && (
        <View style={styles.buttonControls}>
          <StepperRow
            label={t('diagram.stanceWidth')}
            value={`${value.stanceWidthCm}cm`}
            onDecrement={() => adjustStanceWidth(-1)}
            onIncrement={() => adjustStanceWidth(1)}
            theme={theme}
          />
          <StepperRow
            label={t('diagram.setback')}
            value={`${value.setbackCm > 0 ? '+' : ''}${value.setbackCm}cm`}
            onDecrement={() => adjustSetback(-0.5)}
            onIncrement={() => adjustSetback(0.5)}
            theme={theme}
          />
          <StepperRow
            label={t('diagram.frontFoot')}
            value={`${value.frontAngleDeg}°`}
            onDecrement={() => adjustFrontAngle(-1)}
            onIncrement={() => adjustFrontAngle(1)}
            color="#208AEF"
            theme={theme}
          />
          <StepperRow
            label={t('diagram.rearFoot')}
            value={`${value.rearAngleDeg}°`}
            onDecrement={() => adjustRearAngle(-1)}
            onIncrement={() => adjustRearAngle(1)}
            color="#F5A623"
            theme={theme}
          />
        </View>
      )}

      <ThemedText type="small" themeColor="textSecondary" style={styles.instructions}>
        {inputMode === 'drag' ? t('diagram.instructions') : t('diagram.instructionsButton')}
      </ThemedText>
    </View>
  );
}

const NEEDLE_RIGHT_LENGTH = DIAL_SIZE / 2 - 8;
const NEEDLE_LEFT_LENGTH = 8;
const NEEDLE_SHAFT_THICKNESS = 5;
const NEEDLE_HEAD_LENGTH = 10;
const NEEDLE_HEAD_WIDTH = 13;
const NEEDLE_WIDTH = NEEDLE_LEFT_LENGTH + NEEDLE_RIGHT_LENGTH;
const NEEDLE_HEIGHT = NEEDLE_HEAD_WIDTH + 2;

function ArrowNeedle({ color }: { color: string }) {
  const headBaseX = NEEDLE_WIDTH - NEEDLE_HEAD_LENGTH;
  const headTopY = (NEEDLE_HEIGHT - NEEDLE_HEAD_WIDTH) / 2;
  const headBottomY = headTopY + NEEDLE_HEAD_WIDTH;
  const centerY = NEEDLE_HEIGHT / 2;

  return (
    <Svg width={NEEDLE_WIDTH} height={NEEDLE_HEIGHT}>
      <Rect
        x={0}
        y={centerY - NEEDLE_SHAFT_THICKNESS / 2}
        width={headBaseX}
        height={NEEDLE_SHAFT_THICKNESS}
        fill={color}
      />
      <Polygon
        points={`${headBaseX},${headTopY} ${headBaseX},${headBottomY} ${NEEDLE_WIDTH},${centerY}`}
        fill={color}
      />
    </Svg>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
    </View>
  );
}

function RepeatButton({
  onAction,
  theme,
  children,
}: {
  onAction: () => void;
  theme: ReturnType<typeof useTheme>;
  children: React.ReactNode;
}) {
  const actionRef = useRef(onAction);
  actionRef.current = onAction;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    timerRef.current = null;
    intervalRef.current = null;
  }, []);

  useEffect(() => stop, [stop]);

  const start = useCallback(() => {
    actionRef.current();
    timerRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => actionRef.current(), 80);
    }, 300);
  }, []);

  return (
    <Pressable onPressIn={start} onPressOut={stop} style={({ pressed }) => pressed && styles.pressed}>
      <View style={[styles.stepperButton, { backgroundColor: theme.backgroundElement }]}>
        {children}
      </View>
    </Pressable>
  );
}

function StepperRow({
  label,
  value,
  onDecrement,
  onIncrement,
  color,
  theme,
}: {
  label: string;
  value: string;
  onDecrement: () => void;
  onIncrement: () => void;
  color?: string;
  theme: ReturnType<typeof useTheme>;
}) {
  return (
    <View style={styles.stepperRow}>
      <View style={styles.stepperLabel}>
        {color && <View style={[styles.legendDot, { backgroundColor: color }]} />}
        <ThemedText type="small">{label}</ThemedText>
      </View>
      <View style={styles.stepperControls}>
        <RepeatButton onAction={onDecrement} theme={theme}>
          <ThemedText type="smallBold">−</ThemedText>
        </RepeatButton>
        <View style={styles.stepperValue}>
          <ThemedText type="smallBold">{value}</ThemedText>
        </View>
        <RepeatButton onAction={onIncrement} theme={theme}>
          <ThemedText type="smallBold">＋</ThemedText>
        </RepeatButton>
      </View>
    </View>
  );
}

function ReadoutText({ value }: { value: BoardDiagramValue }) {
  const setbackLabel =
    value.setbackCm > 0
      ? `${t('diagram.setback')} ${value.setbackCm}cm`
      : value.setbackCm < 0
        ? `${t('diagram.setfront')} ${Math.abs(value.setbackCm)}cm`
        : t('diagram.center');

  return (
    <View style={styles.readout}>
      <ThemedText type="smallBold">{stanceTypeLabel(value.stance)}</ThemedText>
      <ThemedText type="smallBold">
        {t('diagram.stanceWidth')} {value.stanceWidthCm}cm ／ {setbackLabel}
      </ThemedText>
      <ThemedText type="smallBold">
        {t('diagram.frontFoot')} {value.frontAngleDeg}° ／ {t('diagram.rearFoot')} {value.rearAngleDeg}°
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  diagramRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  leftColumn: {
    width: SIDE_COLUMN_WIDTH,
    height: BOARD_HEIGHT,
    paddingTop: Spacing.three,
    alignItems: 'center',
  },
  rightColumn: {
    width: SIDE_COLUMN_WIDTH,
    height: BOARD_HEIGHT,
    paddingTop: Spacing.three,
    alignItems: 'center',
  },
  toggleButtons: {
    gap: Spacing.four,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.two,
  },
  pressed: {
    opacity: 0.7,
  },
  board: {
    width: BOARD_WIDTH,
    height: BOARD_HEIGHT,
    alignItems: 'center',
  },
  noseLabel: {
    position: 'absolute',
    top: Spacing.three,
  },
  bindingRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: BOARD_WIDTH,
    height: BINDING_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  binding: {
    position: 'absolute',
    width: BINDING_WIDTH,
    height: BINDING_HEIGHT,
  },
  bindingVisual: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  setbackRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: BOARD_WIDTH,
    height: SETBACK_HANDLE_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setbackHandle: {
    width: SETBACK_HANDLE_WIDTH,
    height: SETBACK_HANDLE_HEIGHT,
    borderRadius: SETBACK_HANDLE_HEIGHT / 2,
  },
  dialRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: DIAL_COLUMN_WIDTH,
    height: DIAL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialTouchArea: {
    width: DIAL_SIZE,
    height: DIAL_SIZE,
    borderRadius: DIAL_SIZE / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialTick: {
    position: 'absolute',
    width: NEEDLE_WIDTH,
    height: NEEDLE_HEIGHT,
    left: DIAL_SIZE / 2 - NEEDLE_LEFT_LENGTH,
    top: DIAL_SIZE / 2 - NEEDLE_HEIGHT / 2,
    transformOrigin: `${(NEEDLE_LEFT_LENGTH / NEEDLE_WIDTH) * 100}% 50%`,
  },
  legend: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  legendRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.half,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  readout: {
    alignItems: 'center',
    gap: Spacing.half,
  },
  instructions: {
    textAlign: 'center',
  },
  buttonControls: {
    width: '100%',
    gap: Spacing.two,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.two,
  },
  stepperLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  stepperButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    width: 56,
    alignItems: 'center',
  },
});
