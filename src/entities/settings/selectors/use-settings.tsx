import { useSettingsStore } from "../store";

export const useSettings = () => useSettingsStore((state) => ({
  study: state.study,
  difficultyWeights: state.difficultyWeights,
  resetToDefaults: state.resetToDefaults
}));