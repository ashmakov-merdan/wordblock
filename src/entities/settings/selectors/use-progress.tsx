import { useSettingsStore } from "../store";

export const useProgress = () => useSettingsStore((state) => ({
  progress: state.defaults.progress,
  updateProgress: state.updateProgress
}));
