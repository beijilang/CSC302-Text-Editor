import TextEditor from "../src/TextEditor.js";

describe("Basic in-process tests", () => {
    it("constructs TextEditor and starts", () => {
        if (process.stdout.isTTY) {
            const editor = new TextEditor();
            editor.init("");
            editor.terminate();
        } else {
            console.warn("Not doing in-process tests because we are not running on a TTY");
        }
    });
});
