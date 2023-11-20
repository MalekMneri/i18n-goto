import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "i18n-goto.helloWorld",
    () => {}
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated

function openFile(filePath: string) {
  vscode.workspace.openTextDocument(filePath).then((document) => {
    vscode.window.showTextDocument(document);
  });
}

function getCurrentRootPath(): string | undefined {
  const workspaceFolders = vscode.workspace.workspaceFolders;

  if (workspaceFolders) {
    return workspaceFolders[0].uri.fsPath;
  }

  return undefined;
}

export function deactivate() {}
