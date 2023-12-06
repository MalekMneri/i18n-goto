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
import { getRangeOfAttribute } from "./typescriptAttributeLocator";
import { showTextDialog } from "./util";

export function activate(context: ExtensionContext) {
  const revealAttributeCommand = commands.registerCommand(
    appConfig.revealAttributeCommand.name,
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
          editor.selection = new Selection(range.start, range.end);
        });
      }
    }
  );

  const link = languages.registerDocumentLinkProvider(
    selectors,
    new LinkProvider()
  );

  context.subscriptions.push(revealAttributeCommand, link);
}

function findLabelsUriAndRange(
  uris: Uri[],
  attributeName: string
):
  | { range: Range; attributeUri: Uri; error: false }
  | { error: true } {
  let range: Range | undefined;
  let attributeUri: Uri | undefined;
  for (const uri of uris) {
    range = getRangeOfAttribute(uri, attributeName);
    if (range) {
      attributeUri = uri;
      break;
    }
  }
  if (range === undefined || attributeUri === undefined) {
    return { error: true };
  }

  return { range, attributeUri, error: false };
}

// This method is called when your extension is deactivated
export function deactivate() {}
