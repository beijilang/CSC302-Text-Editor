import { create_Command } from './src/util.js';
import termKit from 'terminal-kit';
import * as fs from 'fs';

class TextEditor {
    constructor(input_parameter = {}) {
        this.term = termKit.terminal;

        this.screenBuffer = new termKit.ScreenBuffer({
			dst: this.term,
			height: this.term.height - 2,
			y: 2
		});

		// this.textBuffer = new terminalKit.TextBuffer({
		// 	dst: this.screenBuffer
		// });
		// this.textBuffer.setText('');
    }

    // Open a file using the library
    openfile(file_name, open_mode) {

    }

}

export default TextEditor;