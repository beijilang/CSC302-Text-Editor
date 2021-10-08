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
    constructor(text) {
        // console.log(text);
        this.text = text;
        // console.log(this.text);
    }
    execute(TextEdtiorObj) {

        TextEdtiorObj.textBuffer.insert(this.text);
        TextEdtiorObj.draw();
    }

    redo(TextEdtiorObj) {
        TextEdtiorObj.textBuffer.backDelete(1);
        TextEdtiorObj.term.move(-1,0);
        TextEdtiorObj.draw_cursor();
        TextEdtiorObj.draw();
    } 

}

class DeleteCommand {
    constructor(delete_index, delete_num) {
        this.textEditor.delete_index = delete_index;
        this.textEditor.delete_num = delete_num;
    }

    execute() {
        // Call execute to delete
    }

    redo() {
        // Call 
    }
}






// Call export here
export {AppendCommand, DeleteCommand, SpaceCommand, TextCommand};