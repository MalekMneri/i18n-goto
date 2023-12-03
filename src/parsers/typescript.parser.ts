import {
  isVariableStatement,
  forEachChild,
  isIdentifier,
  SyntaxKind,
  SourceFile,
  Node,
  createSourceFile,
  ScriptTarget,
  VariableStatement,
} from "typescript";
import { readFileSync } from "fs";
import { Uri } from "vscode";

function findAttributeLine(sourceFile: SourceFile, attributeName: string) {
  let line;

  const visit = (node: Node) => {
    if (
      isVariableStatement(node) &&
      node.modifiers &&
      node.modifiers.some(
        // check if the locales file is exporting an object
        (modifier) => modifier.kind === SyntaxKind.ExportKeyword
      )
    ) {
      node.declarationList.declarations.forEach((declaration) => {
        declaration.forEachChild((child) => {
          if (child.kind === SyntaxKind.ObjectLiteralExpression) {
          }
        });

        const result = recursive(declaration, attributeName.split("."), 0);
        console.log(result);
        if (result !== undefined) {
          line = sourceFile.getLineAndCharacterOfPosition(result.getStart()).line + 1;
        }
      });
    }
    forEachChild(node, visit);
  };

  visit(sourceFile);

  return line;
}

function recursive(
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
    const childResult = recursive(c, attributeName, index);
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
