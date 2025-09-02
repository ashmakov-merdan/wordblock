import { useSettingsStore } from "../store";

export const useAppSettings = () => useSettingsStore((state) => ({
  appSettings: state.defaults.appSettings,
  updateAppSettings: state.updateAppSettings
}));
