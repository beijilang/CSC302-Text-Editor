import { create_Command } from './src/util.js';
import termKit from 'terminal-kit';
import * as fs from 'fs';
import {SnapShotLinkedListNode, TextEditorStateManagementLinkList} from './src/ObjectState'

class TextEditor {
    constructor(input_parameter = {}) {
        this.term = termKit.terminal;

        this.screenBuffer = new termKit.ScreenBuffer({
			dst: this.term,
			height: this.term.height - 2,
			y: 2
		});

		this.textBuffer = new termKit.TextBuffer({
			dst: this.screenBuffer
		})
    }

	// Init a blank terminal for write
	init() {
		this.term.clear();
		this.term.green( 'Hit CTRL-C to quit.\n\n' ) ;
		this.term.grabInput( { mouse: 'button' } ) ;
		this.term.on( 'key' , ( name , matches , data ) => {
			this.handle_key_press_event(name)
		}) ;
		let init_state = SnapShotLinkedListNode();
		this.TextEditorStateManagementLinkList = TextEditorStateManagementLinkList(init_state);
	}


	handle_key_press_event(name) {
		switch(name) {
			case " ":
				this.move_cursor_to_right();
				break;
			case "BACKSPACE":
				this.move_cursor_to_left();
				break;
			case "CTRL_C":
				this.terminate();
				break;
			case "CTRL_Z":
				this.redo();
				break;
		}
	}

	redo() {

	}

	move_cursor_to_right() {
		this.term.right(1);
		this.term.getCursorLocation((error, x, y) => (console.log(x, y)));
	}

	move_cursor_to_left() {
		this.term.left(1);
	}


    openfile(file_name, open_mode) {
		
    }

    terminate() {
		this.term.grabInput( false ) ;
		setTimeout( function() { process.exit() } , 100 ) ;
	}
}

export default TextEditor;