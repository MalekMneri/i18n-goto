import * as vscode from "vscode";
import {
  appConfig,
  setLocalesFolderConfig,
} from "./constants/general.constants";
import { handleConfigureLocalesFolder } from "./commands/configure-locales-folder.command";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    setLocalesFolderConfig.command,
    () => handleConfigureLocalesFolder()
  );

  let disposableTwo = vscode.window.onDidChangeTextEditorSelection(
    (event) => {
      const editor = vscode.window.activeTextEditor;

      console.log('aaaaaaaaaaaa',editor);
    }
  );

  context.subscriptions.push(disposable, disposableTwo);
}

// This method is called when your extension is deactivated

function openFile(filePath: string) {
  vscode.workspace.openTextDocument(filePath).then((document) => {
    vscode.window.showTextDocument(document);
  });
}

export function deactivate() {}
