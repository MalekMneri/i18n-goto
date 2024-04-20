import {
  DocumentLinkProvider as vsDocumentLinkProvider,
  TextDocument,
  ProviderResult,
  DocumentLink,
  Position,
  Range,
  workspace,
  Uri,
} from 'vscode';
import { showTextDialog, getFilePath } from '../utils';
import { appConfig } from '../constants/general.constants';

export interface LocalesSearchParameters {
  Uris: Uri[];
  attributeName: string;
}

export default class LinkProvider implements vsDocumentLinkProvider {
// TODO make this check all strings that have . i.e. 'common.add' and only create the link if it exists in the locales files
  public provideDocumentLinks(
    doc: TextDocument
  ): ProviderResult<DocumentLink[]> {
    const config = workspace.getConfiguration(appConfig.appName);
    let regex: RegExp;

    try {
      regex = new RegExp(config.regex, 'g');
    } catch (error) {
      showTextDialog(`${appConfig.errors.invalidRegex}\n${error}`);

      regex = appConfig.regex;
    }

    let documentLinks = [];
    let index = 0;

    while (index < doc.lineCount) {
      let line = doc.lineAt(index);
      let result = line.text.match(regex);

      if (result !== null) {
        for (let item of result) {
          let linePath = getFilePath(item.replaceAll(/[',"]/g, ''), doc);

          if (linePath !== undefined) {
            let start = new Position(line.lineNumber, line.text.indexOf(item));
            let end = start.translate(0, item.length);
            let documentLink = new DocumentLink(
              new Range(start, end),
              Uri.parse(
                `command:${
                  appConfig.revealAttributeCommand.name
                }?${encodeURIComponent(JSON.stringify(linePath))}`
              )
            );
            documentLink.tooltip = appConfig.tooltipText;
            documentLinks.push(documentLink);
          }
        }
      }

      index++;
    }

    return documentLinks;
  }
}
