import { create_Command } from './src/util.js';
import termKit from 'terminal-kit';
import * as fs from 'fs';
import {SnapShotLinkedListNode, TextEditorStateManagementLinkList} from './src/ObjectState.js'

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
		let init_state = new SnapShotLinkedListNode();
		this.TextEditorStateManagementLinkList = new TextEditorStateManagementLinkList(init_state);
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
				this.undo();
				break;
			case "CTRL_Y":
				this.redo();
				break;
		}
	}

	undo_command() {
		this.TextEditorStateManagementLinkList.get_cur_node().command_obj.redo(this)
	}

	redo_command() {
		this.TextEditorStateManagementLinkList.get_cur_node().command_obj.execute(this)
	}

	insert_and_execute(insert_node) {
		this.TextEditorStateManagementLinkList.insertNewState(insert_node);
		insert_node.command_obj.execute(this);
	}

	undo() {
		let prev_state = this.TextEditorStateManagementLinkList.get_last_action();
		if (prev_state == null) {
			console.log("Can no longer UNDO");
			return;
		}
		this.undo_command();
		this.TextEditorStateManagementLinkList.move_cur_node_to_left();
	}
	
	redo() {
		let next_state = this.TextEditorStateManagementLinkList.get_next_action();
		if (next_state == null) {
			console.log("Can not redo");
			return;
		}
		this.TextEditorStateManagementLinkList.move_cursor_to_right();
		this.redo_command()
	}

	move_cursor_to_right() {
		let appendCommand = create_Command({"command_type": "space"});
		let node = new SnapShotLinkedListNode(appendCommand);
		this.insert_and_execute(node);		
	}

    openfile(file_name, open_mode) {
		
    }

    terminate() {
		this.term.grabInput( false ) ;
		setTimeout( function() { process.exit() } , 100 ) ;
	}
}

export default TextEditor;