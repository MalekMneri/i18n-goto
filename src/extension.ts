import * as vscode from "vscode";
import LinkProvider from "./providers/link.provider";

export function activate(context: vscode.ExtensionContext) {
  let link = vscode.languages.registerDocumentLinkProvider(
    [
      { scheme: "file", language: "typescript" },
      { scheme: "file", language: "javascript" },
      { scheme: "file", language: "typescriptreact" },
      { scheme: "file", language: "javascriptreact" },
    ],
    new LinkProvider()
  );

  context.subscriptions.push(link);
}

// This method is called when your extension is deactivated
export function deactivate() {}
