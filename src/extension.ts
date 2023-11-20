import * as vscode from "vscode";
import {
  appConfig,
  setLocalesFolderConfig,
} from "./constants/general.constants";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    setLocalesFolderConfig.command,
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
          ...setLocalesFolderConfig.window,
        })
        .then((folderUris) => {
          if (folderUris && folderUris.length > 0) {
            const selectedFileUri = folderUris[0];
            const localesConfig = vscode.workspace.getConfiguration(
              appConfig.appName,
              vscode.workspace.workspaceFile
            );
            setLocalesFolder(localesConfig, selectedFileUri.path);

            vscode.window.showInformationMessage(
              setLocalesFolderConfig.successMessage(selectedFileUri?.path),
              setLocalesFolderConfig.DismissButtonLabel
            );
          }
        });
    }
  );

  let disposableTwo = vscode.commands.registerCommand("i18n-goto.test", () =>
    console.log(getLocalesFolder())
  );

  context.subscriptions.push(disposable, disposableTwo);
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
  const localesConfig = vscode.workspace.getConfiguration(appConfig.appName);

  const path = localesConfig.get(
    setLocalesFolderConfig.sectionName,
    vscode.workspace.workspaceFile
  ) as unknown as string;

  if (!path || path === "undefined") {
    const defaultPath = `${getCurrentRootPath()}/src/locales`;
    setLocalesFolder(localesConfig, defaultPath);

    return defaultPath;
  }

  return path;
}

function setLocalesFolder(
  localesConfig: vscode.WorkspaceConfiguration,
  filePath: string
) {
  localesConfig.update(
    setLocalesFolderConfig.sectionName,
    filePath,
    vscode.ConfigurationTarget.Workspace
  );
}

export function deactivate() {}
