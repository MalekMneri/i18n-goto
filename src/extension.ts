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
import { appConfig, selectors } from "./constants/general.constants";
import { getLineOfAttribute } from "./typescriptAttributeLocator";
import { showTextDialog } from "./util";

export function activate(context: ExtensionContext) {
  const gotoCommand = commands.registerCommand(
    appConfig.goToLineCommand.name,
    (params: LocalesSearchParameters) => {
      if (params && params.attributeName && params.Uris.length > 0) {
        const result = findLabelsUriAndRange(params.Uris, params.attributeName);
        if (result.error) {
          showTextDialog(appConfig.errors.notFound);
          return;
        }
        const { range, attributeUri } = result;

        window.showTextDocument(attributeUri).then((editor) => {
          editor.revealRange(range, TextEditorRevealType.InCenter);
          editor.selection = new Selection(range.start, range.start);
        });
      }
    }
  );

  const link = languages.registerDocumentLinkProvider(
    selectors,
    new LinkProvider()
  );

  context.subscriptions.push(gotoCommand, link);
}

function findLabelsUriAndRange(
  uris: Uri[],
  attributeName: string
):
  | { range: Range; attributeUri: Uri; error: false }
  | { error: true } {
  let lineNumber: number | undefined;
  let attributeUri: Uri | undefined;
  for (const uri of uris) {
    lineNumber = getLineOfAttribute(uri, attributeName);
    if (lineNumber) {
      attributeUri = uri;
      break;
    }
  }
  if (lineNumber === undefined || attributeUri === undefined) {
    return { error: true };
  }

  const range = new Range(lineNumber - 1, 0, lineNumber, 0);

  return { range, attributeUri, error: false };
}

// This method is called when your extension is deactivated
export function deactivate() {}
