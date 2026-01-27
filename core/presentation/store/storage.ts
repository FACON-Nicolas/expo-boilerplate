import type { StorageAdapter } from "@/core/domain/storage/storage-adapter";

let storage: StorageAdapter | null = null;

export const initializeStorage = (adapter: StorageAdapter): void => {
  storage = adapter;
};

export const getStorage = (): StorageAdapter => {
  if (!storage) {
    throw new Error("Storage not initialized. Call initializeStorage first.");
  }
  return storage;
};
