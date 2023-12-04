export const appConfig = {
  appName: "i18n-goto",
  tooltipText: "go to locales file",
  regex: /(?<=t\(\')([^'"]+)(?=['"])/g,
  goToLineCommand: {
    name: "i18n-goto.openLine",
  },
  errors: {
    notFound: "This label does not exist in your locales files!",
    invalidRegex: "Invalid custom regex:",
  },
};