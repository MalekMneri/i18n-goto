import {
  Selection,
  TextEditorRevealType,
  commands,
  window,
  Range,
  languages,
  ExtensionContext,
  Uri,
} from "vscode";
import LinkProvider, {
  LocalesSearchParameters,
} from "./providers/link.provider";
import { appConfig } from "./constants/general.constants";
import { getLineOfAttribute } from "./parsers/typescript.parser";

export function activate(context: ExtensionContext) {
  const gotoCommand = commands.registerCommand(
    appConfig.goToLineCommand.name,
    (params: LocalesSearchParameters) => {
      if (params && params.attributeName && params.Uris.length > 0) {
        let lineNumber: number | undefined;
        let attributeUri: Uri | undefined;
        for (const uri of params.Uris) {
          lineNumber = getLineOfAttribute(uri, params.attributeName);
          if (lineNumber) {
            attributeUri = uri;
            break;
          }
        }

        if (lineNumber === undefined || attributeUri === undefined) {
          window.showInformationMessage(
            "This label does not exist in your locales files!",
            "Dismiss"
          );
          return;
        }

        const range = new Range(lineNumber - 1, 0, lineNumber, 0);
        window.showTextDocument(attributeUri).then((editor) => {
          editor.revealRange(range, TextEditorRevealType.InCenter);
          editor.selection = new Selection(range.start, range.start);
        });
      }
    }
  );

  const link = languages.registerDocumentLinkProvider(
    [
      { scheme: "file", language: "typescript" },
      { scheme: "file", language: "javascript" },
      { scheme: "file", language: "typescriptreact" },
      { scheme: "file", language: "javascriptreact" },
    ],
    new LinkProvider()
  );

  context.subscriptions.push(gotoCommand, link);
}

// This method is called when your extension is deactivated
export function deactivate() {}
