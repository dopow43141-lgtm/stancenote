import { createCollection } from './collection';

import { SettingRecord, SettingRecordInput } from '@/types/setting';

const settingsCollection = createCollection<SettingRecord>('stancenote.settings.v1');

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function getSettingRecords(): Promise<SettingRecord[]> {
  const records = await settingsCollection.getAll();
  return records.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getSettingRecord(id: string) {
  return settingsCollection.get(id);
}

export async function addSettingRecord(input: SettingRecordInput): Promise<SettingRecord> {
  const record: SettingRecord = {
    ...input,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  await settingsCollection.put(record);
  return record;
}

export async function updateSettingRecord(id: string, input: SettingRecordInput): Promise<void> {
  const existing = await settingsCollection.get(id);
  if (!existing) return;
  await settingsCollection.put({ ...existing, ...input });
}

export const deleteSettingRecord = settingsCollection.remove;
