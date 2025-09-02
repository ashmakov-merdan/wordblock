import { useSettingsStore } from "../store";

export const useBlockingSettings = () => useSettingsStore(state => ({
  blockingSettings: state.defaults.blockingSettings,
  updateBlockingSettings: state.updateBlockingSettings
}));
