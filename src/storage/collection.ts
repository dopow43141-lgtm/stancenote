import AsyncStorage from '@react-native-async-storage/async-storage';

export function createCollection<T extends { id: string }>(key: string) {
  async function getAll(): Promise<T[]> {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as T[];
    } catch {
      return [];
    }
  }

  async function setAll(items: T[]): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(items));
  }

  async function get(id: string): Promise<T | undefined> {
    const items = await getAll();
    return items.find((item) => item.id === id);
  }

  async function put(item: T): Promise<void> {
    const items = await getAll();
    const index = items.findIndex((existing) => existing.id === item.id);
    if (index === -1) {
      items.push(item);
    } else {
      items[index] = item;
    }
    await setAll(items);
  }

  async function remove(id: string): Promise<void> {
    const items = await getAll();
    await setAll(items.filter((item) => item.id !== id));
  }

  return { getAll, get, put, remove };
}
