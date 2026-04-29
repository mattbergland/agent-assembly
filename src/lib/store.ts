import { CheckIn, EventConfig, DEFAULT_EVENT_CONFIG } from "./types";
import { useSyncExternalStore, useCallback } from "react";

const CHECKINS_KEY = "event-checkin-data";
const CONFIG_KEY = "event-checkin-config";

function readCheckins(): CheckIn[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(CHECKINS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as CheckIn[];
  } catch {
    return [];
  }
}

function readConfig(): EventConfig {
  if (typeof window === "undefined") return DEFAULT_EVENT_CONFIG;
  const raw = localStorage.getItem(CONFIG_KEY);
  if (!raw) return DEFAULT_EVENT_CONFIG;
  try {
    return JSON.parse(raw) as EventConfig;
  } catch {
    return DEFAULT_EVENT_CONFIG;
  }
}

// Simple pub/sub for checkins changes
const checkinsListeners = new Set<() => void>();

function emitCheckinsChange() {
  checkinsListeners.forEach((l) => l());
  window.dispatchEvent(new Event("checkins-updated"));
}

function subscribeCheckins(listener: () => void): () => void {
  checkinsListeners.add(listener);

  const onStorage = (e: StorageEvent) => {
    if (e.key === CHECKINS_KEY) {
      listener();
    }
  };
  const onCustom = () => listener();
  window.addEventListener("storage", onStorage);
  window.addEventListener("checkins-updated", onCustom);

  return () => {
    checkinsListeners.delete(listener);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("checkins-updated", onCustom);
  };
}

function getCheckinsSnapshot(): CheckIn[] {
  return readCheckins();
}

function getCheckinsServerSnapshot(): CheckIn[] {
  return [];
}

export function useCheckins(): CheckIn[] {
  // memoize snapshot to avoid infinite re-render
  const getSnapshot = useCallback(() => {
    const data = getCheckinsSnapshot();
    const key = JSON.stringify(data);
    if (cachedCheckinsKey !== key) {
      cachedCheckinsKey = key;
      cachedCheckins = data;
    }
    return cachedCheckins;
  }, []);

  return useSyncExternalStore(
    subscribeCheckins,
    getSnapshot,
    getCheckinsServerSnapshot
  );
}

let cachedCheckinsKey = "";
let cachedCheckins: CheckIn[] = [];

export function useEventConfig(): EventConfig {
  return readConfig();
}

export function getCheckins(): CheckIn[] {
  return readCheckins();
}

export function addCheckin(checkin: CheckIn): void {
  const all = readCheckins();
  all.push(checkin);
  localStorage.setItem(CHECKINS_KEY, JSON.stringify(all));
  emitCheckinsChange();
}

export function deleteCheckin(id: string): void {
  const all = readCheckins().filter((c) => c.id !== id);
  localStorage.setItem(CHECKINS_KEY, JSON.stringify(all));
  emitCheckinsChange();
}

export function clearCheckins(): void {
  localStorage.removeItem(CHECKINS_KEY);
  emitCheckinsChange();
}

export function getEventConfig(): EventConfig {
  return readConfig();
}

export function saveEventConfig(config: EventConfig): void {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}
