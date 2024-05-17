import * as assert from "assert";

import { getRangeOfAttribute } from "../../typescriptAttributeLocator";
import { Position, Range, Uri, window } from "vscode";
import * as path from "path";

suite("Extension Test Suite", () => {
  window.showInformationMessage("Start all tests.");
  const filePath = path.join(__dirname, "/out/test-files/common.ts");
  const file = Uri.file(filePath);
  const range = getRangeOfAttribute(file, "example.label");
  console.log("range");
  console.log(range);

  test("main scenario", () => {
    // const filePath = path.join(__dirname, "/out/test-files/common.ts");
    const range = getRangeOfAttribute(
      Uri.file(
        "file:///home/malek/Desktop/code/i18n-goto/src/test/suite/test-files/common.ts"
      ),
      "example.label"
    );
    console.log(range);

    const expectedRange = new Range(new Position(1, 2), new Position(1, 2));

    assert.strictEqual(range, expectedRange);
  });
});
