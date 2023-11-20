import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "i18n-goto.configLocalesFolder",
     () => {
      const currentRootFolder = getCurrentRootPath();
      if (!currentRootFolder) {
        return;
      }

       vscode.window
        .showOpenDialog({
          defaultUri: vscode.Uri.file(currentRootFolder),
          canSelectFiles: false,
          canSelectFolders: true,
          canSelectMany: false,
          title: "Choose locales folder",
          openLabel: "Set as locales folder",
        })
        .then((folderUris) => {
          if (folderUris && folderUris.length > 0) {
            const selectedFileUri = folderUris[0];
            const localesConfig =
              vscode.workspace.getConfiguration("i18n-goto");

            localesConfig.update(
              "localesFile",
              selectedFileUri.fsPath,
              vscode.ConfigurationTarget.WorkspaceFolder
            );

            vscode.window.showInformationMessage(
              `Locales folder configured as: \n ${selectedFileUri?.fsPath}`,
              "Dismiss"
            );
          }
        });

      
    }
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

function getLocalesFolder() {
  // TODO get locales folder from extension settings file
  throw new Error("not implemented");
}

export function deactivate() {}
