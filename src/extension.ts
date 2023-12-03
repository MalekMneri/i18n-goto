import {
  Selection,
  TextEditorRevealType,
  commands,
  window,
  Range,
  languages,
  ExtensionContext,
} from "vscode";
import LinkProvider, { linePath } from "./providers/link.provider";
import { appConfig } from "./constants/general.constants";
import { getLineOfAttribute } from "./parsers/typescript.parser";

export function activate(context: ExtensionContext) {
  const gotoCommand = commands.registerCommand(
    appConfig.goToLineCommand.name,
    (params: linePath) => {
      if (params && params.attributeArray) {
        const lineNumber = getLineOfAttribute(
          params.Uri,
          params.attributeArray.join(".")
        );

        // TODO go over each folder in locales

        if (lineNumber === undefined) {
          // TODO show info dialog
          return;
        }
        const range = new Range(lineNumber - 1, 0, lineNumber, 0);
        window.showTextDocument(params.Uri).then((editor) => {
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
