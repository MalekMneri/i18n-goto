export const appConfig = {
  appName: "i18n-goto",
  tooltipText: "go to locales file",
  regex: /(?<=t\(\')([^'"]+)(?=['"])/g,
  goToLineCommand: {
    name: "i18n-goto.openLine",
  },
};