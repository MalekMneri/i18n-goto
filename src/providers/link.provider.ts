import {
  DocumentLinkProvider as vsDocumentLinkProvider,
  TextDocument,
  ProviderResult,
  DocumentLink,
  Position,
  Range,
  workspace,
  Uri,
} from "vscode";
import * as utils from "../util";
import { appConfig } from "../constants/general.constants";

export interface LocalesSearchParameters {
  Uris: Uri[];
  attributeName: string;
}

export default class LinkProvider implements vsDocumentLinkProvider {
  public provideDocumentLinks(
    doc: TextDocument
  ): ProviderResult<DocumentLink[]> {
    const config = workspace.getConfiguration(appConfig.appName);
    let regex: RegExp;

    try {
      regex = new RegExp(config.regex, "g");
    } catch (error) {
      utils.showTextDialog(`${appConfig.errors.invalidRegex}\n${error}`);

      regex = appConfig.regex;
    }

    let documentLinks = [];
    let index = 0;

    while (index < doc.lineCount) {
      let line = doc.lineAt(index);
      let result = line.text.match(regex);

      if (result !== null) {
        let position = 0;
        for (let item of result) {
          let linePath = utils.getFilePath(item, doc);

          if (linePath !== undefined) {
            position = line.text.indexOf(item, position);
            let start = new Position(line.lineNumber, position + 1);
            let end = start.translate(0, item.length - 2);
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
