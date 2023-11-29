export const appConfig = {
  appName: "i18n-goto",
};


export const setLocalesFolderConfig = {
  command: `commands.configLocalesFolder`,
  sectionName: "localesFolder",
  successMessage: (path: string) => `Locales folder configured as:\n${path}`,
  DismissButtonLabel: "Dismiss",
  window: {
    title: "Choose locales folder",
    openLabel: "Set as locales folder",
  },
};