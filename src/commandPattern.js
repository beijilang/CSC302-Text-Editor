// Initialize class that has the same structure as the above to make changes. For exmaple, when appending, should Init AppendCommand,
// And initialize it with the append index and content;

class AppendCommand {
    constructor(append_index, append_content) {
        this.textEditor.append_index = append_index;
        this.textEditor.append_content = append_content;
    }
    execute() {
        // Call Execute to make changes
    }

    redo() {
        // Call it to undo the executed change
    }
}

class SpaceCommand {
    constructor() {

    }
    execute(TextEdtiorObj) {
        TextEdtiorObj.term.right(1);
    }

    redo(TextEdtiorObj) {
        TextEdtiorObj.term.left(1);
    }

}

class TextCommand {
    constructor(text, x, y) {
        // console.log(text);
        this.text = text;
        this.x = x;
        this.y = y;
        // console.log(this.text);
    }
    execute(TextEdtiorObj) {
        TextEdtiorObj.textBuffer.insert(this.text);
        TextEdtiorObj.draw_cursor();
    }

    redo(TextEdtiorObj) {
        // console.log(this);
        TextEdtiorObj.textBuffer.moveTo(this.x, this.y);
        TextEdtiorObj.textBuffer.backDelete(1);
        TextEdtiorObj.draw_cursor();
    } 
}

class DeleteCommand {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    execute(TextEditorObj) {
        console.log(this.x, this.y);
        let obj = TextEditorObj.get_char_at_location(this.x, this.y);
        this.deleted_char = obj.char;
        TextEditorObj.textBuffer.backDelete(1);
        TextEditorObj.draw_cursor();
    }
    redo(TextEditorObj) {
        TextEditorObj.textBuffer.moveTo(this.x - 2, this.y - 2);
        TextEditorObj.textBuffer.insert(this.deleted_char);
        TextEditorObj.draw_cursor();
        return;
    }
}






// Call export here
export {AppendCommand, DeleteCommand, SpaceCommand, TextCommand};