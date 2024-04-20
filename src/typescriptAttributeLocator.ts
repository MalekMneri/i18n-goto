import {
  isVariableStatement,
  forEachChild,
  SyntaxKind,
  SourceFile,
  Node,
  createSourceFile,
  ScriptTarget,
} from 'typescript';
import { readFileSync } from 'fs';
import { Uri, Range, Position } from 'vscode';

function findAttributeRange(
  sourceFile: SourceFile,
  attributeName: string
): Range | undefined {
  let range: Range | undefined;

  forEachChild(sourceFile, (node) => {
    if (
      isVariableStatement(node) &&
      node.modifiers &&
      node.modifiers.some(
        (modifier) => modifier.kind === SyntaxKind.ExportKeyword
      )
    ) {
      const result = findPropertyNode(node, attributeName.split('.'), 0);

      if (result !== undefined) {
        const start = sourceFile.getLineAndCharacterOfPosition(
          result.getStart()
        );
        const end = sourceFile.getLineAndCharacterOfPosition(result.getEnd());
        range = new Range(
          new Position(start.line, start.character),
          new Position(end.line, end.character)
        );
      }
    }
  });

  return range;
}

function findPropertyNode(
  node: Node,
  attributeName: string[],
  index: number
): Node | undefined {
  if (
    node.kind === SyntaxKind.PropertyAssignment &&
    attributeName[index] === node.getChildAt(0).getText()
  ) {
    index++;
    if (attributeName.length === index) {
      return node;
    }
  }

  let result: Node | undefined;

  node.forEachChild((c) => {
    const childResult = findPropertyNode(c, attributeName, index);
    if (childResult) {
      result = childResult;
    }
  });

  return result;
}

// TODO make this function accept an array of uri and return the uri and range of the found attribute or null
export function getRangeOfAttribute(fileUri: Uri, attributeName: string) {
  const sourceCode = readFileSync(fileUri.fsPath, 'utf-8');
  const sourceFile = createSourceFile(
    fileUri.path,
    sourceCode,
    ScriptTarget.Latest,
    true
  );

  return findAttributeRange(sourceFile, attributeName);
}
