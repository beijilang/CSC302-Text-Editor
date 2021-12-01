import TextEditor from "../src/TextEditor.js";

describe("Basic tests", () => {
    it("constructs and starts", () => {
        const editor = new TextEditor();
        editor.init("");
        editor.terminate();
    });
});
