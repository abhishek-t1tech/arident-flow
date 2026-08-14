import { getDatabase } from "../db";
import { UserPreferenceRecord } from "../schema";

const DEFAULT_PREFERENCES: UserPreferenceRecord = {
  id: "default",
  theme: "system",
  reducedMotion: false,
  density: "comfortable",
  defaultIterations: 5000,
};

export async function getPreferences(): Promise<UserPreferenceRecord> {
  const record = await getDatabase().preferences.get("default");
  return record ?? DEFAULT_PREFERENCES;
}

export async function putPreferences(preferences: UserPreferenceRecord): Promise<void> {
  await getDatabase().preferences.put(preferences);
}
