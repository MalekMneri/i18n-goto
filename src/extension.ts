import {
  Selection,
  TextEditorRevealType,
  commands,
  window,
  Range,
  languages,
  ExtensionContext,
  Uri,
} from 'vscode';
import LinkProvider, {
  LocalesSearchParameters,
} from './providers/link.provider';
import { appConfig, selectors } from './constants/general.constants';
import { getRangeOfAttribute } from './typescriptAttributeLocator';
import { showTextDialog } from './utils';

export function activate(context: ExtensionContext) {
  const revealAttributeCommand = commands.registerCommand(
    appConfig.revealAttributeCommand.name,
    (params: LocalesSearchParameters) => {
      if (!params?.attributeName || params.Uris.length > 0) {
        return;
      }

      try {
        const { range, attributeUri } = findLabelsUriAndRangeOrFail(
          params.Uris,
          params.attributeName
        );

        window.showTextDocument(attributeUri).then((editor) => {
          editor.revealRange(range, TextEditorRevealType.InCenter);
          editor.selection = new Selection(range.start, range.end);
        });
      } catch (error) {
        showTextDialog((error as { message: string }).message);
      }
    }
  );

  const link = languages.registerDocumentLinkProvider(
    selectors,
    new LinkProvider()
  );

  context.subscriptions.push(revealAttributeCommand, link);
}

/**
 * Finds the range and attribute URI for a given attribute name in an array of URIs.
 *
 * @throws {Error} if the attribute was not found
 *
 * @param {Uri[]} uris - An array of URIs to search through.
 * @param {string} attributeName - The name of the attribute to search for.
 *
 * @returns {{ range: Range; attributeUri: Uri }} An object containing the URI of the attribute found and its range.
 */
function findLabelsUriAndRangeOrFail(
  uris: Uri[],
  attributeName: string
): { range: Range; attributeUri: Uri } {
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
    throw new Error(appConfig.errors.notFound);
  }

  return { range, attributeUri };
}

// This method is called when your extension is deactivated
export function deactivate() {}
