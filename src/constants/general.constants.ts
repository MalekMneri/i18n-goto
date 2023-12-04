import { DocumentSelector } from "vscode";

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


// file types on which this extension works
export const selectors: DocumentSelector = [
  { scheme: "file", language: "typescript" },
  { scheme: "file", language: "javascript" },
  { scheme: "file", language: "typescriptreact" },
  { scheme: "file", language: "javascriptreact" },
];
