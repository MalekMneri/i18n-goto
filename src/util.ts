import { workspace, TextDocument, Uri } from "vscode";
import * as fs from "fs";
import * as path from "path";

export function getFilePath(text: string, document: TextDocument) {
  let paths = getFilePaths(text, document);
  return paths.length > 0 ? paths[0] : null;
}

export function getFilePaths(text: string, document: TextDocument) {
  let workspaceFolder =
    workspace.getWorkspaceFolder(document.uri)?.uri.fsPath || "";
  let paths = scanLocalesPaths(workspaceFolder);

  let result = [];

  for (let item of paths) {
    let tsFilePath = path.join(item, `${text}.ts`);
    let jsFilePath = path.join(item, `${text}.js`);

    if (fs.existsSync(tsFilePath)) {
      result.push({
        name: item,
        fileUri: Uri.file(tsFilePath),
      });
    }else if (fs.existsSync(jsFilePath)) {
      result.push({
        name: item,
        fileUri: Uri.file(jsFilePath),
      });
    }
  }

  return result;
}

function scanLocalesPaths(workspaceFolder: string) {
  let folders: string[] = [];

  let modulePath = path.join(workspaceFolder, "src/locales");
  if (fs.existsSync(modulePath)) {
    fs.readdirSync(modulePath).forEach((element) => {
      let file = path.join(modulePath, element);
      if (fs.statSync(file).isDirectory()) {
        folders.push(path.join(modulePath, element));
      }
    });
  }

  return folders;
}
