import {
  DocumentLinkProvider as vsDocumentLinkProvider,
  TextDocument,
  ProviderResult,
  DocumentLink,
  Position,
  Range,
  workspace,
} from "vscode";
import * as util from "../util";
import { appConfig } from "../constants/general.constants";

export default class LinkProvider implements vsDocumentLinkProvider {
  public provideDocumentLinks(
    doc: TextDocument
  ): ProviderResult<DocumentLink[]> {
    let documentLinks = [];

    let linesCount = doc.lineCount;
    let index = 0;

    while (index < linesCount) {
      let line = doc.lineAt(index);
      let result = line.text.match(appConfig.regex);

      if (result !== null) {
        for (let item of result) {
          const pathArray = item.split(".");
          const fileName = pathArray.shift()!;
          // TODO use remaining items in pathArray to go to exact line

          let file = util.getFilePath(fileName, doc);

          if (file !== null) {
            let start = new Position(line.lineNumber, line.text.indexOf(item));
            let end = start.translate(0, item.length);
            let documentLink = new DocumentLink(
              new Range(start, end),
              file.fileUri
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
