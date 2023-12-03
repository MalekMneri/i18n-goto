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
import * as util from "../util";
import { appConfig } from "../constants/general.constants";

export interface linePath {
  Uri: Uri;
  attributeArray: string[];
}

export default class LinkProvider implements vsDocumentLinkProvider {
  public provideDocumentLinks(
    doc: TextDocument
  ): ProviderResult<DocumentLink[]> {
    let documentLinks = [];
    let index = 0;

    while (index < doc.lineCount) {
      let line = doc.lineAt(index);
      let result = line.text.match(appConfig.regex);

      if (result !== null) {
        for (let item of result) {
          let linePath = util.getFilePath(item, doc);

          if (linePath !== undefined) {
            let start = new Position(line.lineNumber, line.text.indexOf(item));
            let end = start.translate(0, item.length);
            let documentLink = new DocumentLink(
              new Range(start, end),
              Uri.parse(
                `command:${appConfig.goToLineCommand.name}?${encodeURIComponent(
                  JSON.stringify(linePath)
                )}`
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
