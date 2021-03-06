// Initialize class that has the same structure as the above to make changes. For exmaple, when appending, should Init AppendCommand,
// And initialize it with the append index and content;

class EnterCommand {
    constructor(x, y, c_type) {
        this.c_type = c_type;
    }

    execute(TextEditorObj) {
        TextEditorObj.textBuffer.newLine();
        this.undo_x = TextEditorObj.textBuffer.cx;
        this.undo_y = TextEditorObj.textBuffer.cy;
        TextEditorObj.draw_cursor();
    }

    redo(TextEditorObj) {
        TextEditorObj.textBuffer.backDelete(1);
        this.x = TextEditorObj.textBuffer.cx;
        this.y = TextEditorObj.textBuffer.cy;
        TextEditorObj.draw_cursor();
    }
}

class RecordCommand {
    constructor(x, y, record_key_stroke) {
        this.record_key_stroke = record_key_stroke
        this.backdelete_length = record_key_stroke.length
    }

    input_series(TextEditorObj) {
        for(let j = 0; j < this.record_key_stroke.length; j++){
            TextEditorObj.handle_key_press_event(this.record_key_stroke[j][0], this.record_key_stroke[j][1])
        }
    }

    execute(TextEditorObj) {
        this.input_series(TextEditorObj)
        this.undo_x = TextEditorObj.textBuffer.cx;
        this.undo_y = TextEditorObj.textBuffer.cy;
        TextEditorObj.draw_cursor();
    }

    redo(TextEditorObj) {
        TextEditorObj.textBuffer.backDelete(this.backdelete_length);
        this.x = TextEditorObj.textBuffer.cx;
        this.y = TextEditorObj.textBuffer.cy;
        TextEditorObj.draw_cursor();
    }
}

class TabCommand {
    constructor(x, y, c_type) {
        this.x = x;
        this.y = y;
        this.c_type = c_type;
    }

    execute(TextEditorObj) {
        TextEditorObj.textBuffer.insert("\t");
        this.undo_x = TextEditorObj.textBuffer.cx;
        this.undo_y = TextEditorObj.textBuffer.cy;
        TextEditorObj.draw_cursor();
    }

    redo(TextEditorObj) {
        TextEditorObj.textBuffer.backDelete(1);
        this.x = TextEditorObj.textBuffer.cx;
        this.y = TextEditorObj.textBuffer.cy;
        TextEditorObj.draw_cursor();
    }
}

class TextCommand {
    constructor(text, x, y, c_type) {
        this.text = text;
        this.c_type = c_type;
    }

    execute(TextEditorObj) {
        TextEditorObj.textBuffer.insert(this.text);
        this.undo_x = TextEditorObj.textBuffer.cx;
        this.undo_y = TextEditorObj.textBuffer.cy;
        TextEditorObj.draw_cursor();
    }

    redo(TextEditorObj) {
        TextEditorObj.textBuffer.backDelete(1);
        this.x = TextEditorObj.textBuffer.cx;
        this.y = TextEditorObj.textBuffer.cy;
        TextEditorObj.draw_cursor();
    }
}

class DeleteCommand {
    constructor(x, y, c_type) {
        this.x = x;
        this.y = y;
        this.c_type = c_type;
    }

    execute(TextEditorObj) {
        const obj = TextEditorObj.get_char_at_location(this.x, this.y);
        this.deleted_char = obj.char;
        TextEditorObj.textBuffer.backDelete(1);
        this.undo_x = TextEditorObj.textBuffer.cx;
        this.undo_y = TextEditorObj.textBuffer.cy;
        TextEditorObj.draw_cursor();
    }

    redo(TextEditorObj) {
        TextEditorObj.textBuffer.insert(this.deleted_char);
        this.x = TextEditorObj.textBuffer.cx;
        this.y = TextEditorObj.textBuffer.cy;
        TextEditorObj.draw_cursor();
    }
}

// Call export here
export { DeleteCommand, TextCommand, EnterCommand, TabCommand, RecordCommand};
