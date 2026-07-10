import { t } from '@/i18n';

export const RIDING_STYLES = [
  'フリーラン',
  'カービング',
  'ジャンプ',
  'グラトリ',
  'ナチュラル',
  'ジブ',
] as const;
export type RidingStyle = (typeof RIDING_STYLES)[number];

const ridingStyleKeys: Record<RidingStyle, string> = {
  'フリーラン': 'ridingStyles.freeride',
  'カービング': 'ridingStyles.carving',
  'ジャンプ': 'ridingStyles.jump',
  'グラトリ': 'ridingStyles.groundTrick',
  'ナチュラル': 'ridingStyles.natural',
  'ジブ': 'ridingStyles.jib',
};

export function ridingStyleLabel(style: RidingStyle): string {
  return t(ridingStyleKeys[style]);
}

export const STANCE_TYPES = ['レギュラー', 'グーフィー'] as const;
export type StanceType = (typeof STANCE_TYPES)[number];

const stanceTypeKeys: Record<StanceType, string> = {
  'レギュラー': 'stanceTypes.regular',
  'グーフィー': 'stanceTypes.goofy',
};

export function stanceTypeLabel(style: StanceType): string {
  return t(stanceTypeKeys[style]);
}

export type SettingRecord = {
  id: string;
  createdAt: string;
  title?: string;
  stanceWidthCm: number;
  frontAngleDeg: number;
  rearAngleDeg: number;
  setbackCm: number;
  stance: StanceType;
  ridingStyle: RidingStyle[];
  memo: string;
  boardBrand?: string;
  boardModel?: string;
  boardSize?: string;
  bindingBrand?: string;
  bindingModel?: string;
  photoUri?: string;
  mediaUris?: string[];
  review?: number;
  resort?: string;
  snowCondition?: string;
};

export type SettingRecordInput = Omit<SettingRecord, 'id' | 'createdAt'>;
