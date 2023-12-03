import { workspace, TextDocument, Uri } from "vscode";
import * as fs from "fs";
import * as path from "path";
import { LocalesSearchParameters } from "./providers/link.provider";

export function getFilePath(
  text: string,
  document: TextDocument
): LocalesSearchParameters | undefined {
  let workspaceFolder =
    workspace.getWorkspaceFolder(document.uri)?.uri.fsPath || "";
  let paths = scanLocalesPaths(workspaceFolder);

  const attributeArray = text.split(".");
  const fileName = attributeArray.shift()!;
  const uris: Uri[] = [];

  for (let item of paths) {
    let tsFilePath = path.join(item, `${fileName}.ts`);
    let jsFilePath = path.join(item, `${fileName}.js`);

    if (fs.existsSync(tsFilePath)) {
      uris.push(Uri.file(tsFilePath));
    } else if (fs.existsSync(jsFilePath)) {
      uris.push(Uri.file(jsFilePath));
    }
  }

  return {
    Uris: uris,
    attributeName: attributeArray.join("."),
  };
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
