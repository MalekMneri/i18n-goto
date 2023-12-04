import {
  isVariableStatement,
  forEachChild,
  SyntaxKind,
  SourceFile,
  Node,
  createSourceFile,
  ScriptTarget,
} from "typescript";
import { readFileSync } from "fs";
import { Uri } from "vscode";

function findAttributeLine(
  sourceFile: SourceFile,
  attributeName: string
): number | undefined {
  let line;

  forEachChild(sourceFile, (node) => {
    if (
      isVariableStatement(node) &&
      node.modifiers &&
      node.modifiers.some(
        (modifier) => modifier.kind === SyntaxKind.ExportKeyword
      )
    ) {
      const result = findPropertyNode(node, attributeName.split("."), 0);

      if (result !== undefined) {
        line =
          sourceFile.getLineAndCharacterOfPosition(result.getStart()).line + 1;
      }
    }
  });

  return line;
}

function findPropertyNode(
  node: Node,
  attributeName: string[],
  index: number
): Node | undefined {
  if (node.kind === SyntaxKind.PropertyAssignment) {
    if (attributeName[index] === node.getChildAt(0).getText().split(" ")[0]) {
      index++;
      if (attributeName.length === index) {
        return node;
      }
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

export function getLineOfAttribute(fileUri: Uri, attributeName: string) {
  const sourceCode = readFileSync(fileUri.path, "utf-8");
  const sourceFile = createSourceFile(
    fileUri.path,
    sourceCode,
    ScriptTarget.Latest,
    true
  );

  return findAttributeLine(sourceFile, attributeName);
}
