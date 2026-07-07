import { createCollection } from './collection';

import { BindingProfile, BoardProfile } from '@/types/board';

const boardsCollection = createCollection<BoardProfile>('stancenote.boards.v1');
const bindingsCollection = createCollection<BindingProfile>('stancenote.bindings.v1');

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getBoards(): Promise<BoardProfile[]> {
  return boardsCollection.getAll();
}

export async function addBoard(input: Omit<BoardProfile, 'id'>): Promise<BoardProfile> {
  const board: BoardProfile = { ...input, id: generateId() };
  await boardsCollection.put(board);
  return board;
}

export const deleteBoard = boardsCollection.remove;

export function getBindings(): Promise<BindingProfile[]> {
  return bindingsCollection.getAll();
}

export async function addBinding(input: Omit<BindingProfile, 'id'>): Promise<BindingProfile> {
  const binding: BindingProfile = { ...input, id: generateId() };
  await bindingsCollection.put(binding);
  return binding;
}

export const deleteBinding = bindingsCollection.remove;
