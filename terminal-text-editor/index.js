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

    draw_cursor() {
		this.textBuffer.draw();
		this.screenBuffer.draw({
			delta: true
		});
		this.textBuffer.drawCursor();
		this.screenBuffer.drawCursor();
    }

	// Init a blank terminal for write
	init() {
        this.term.clear();
		this.term.green( 'Hit CTRL-C to quit.\n\n' ) ;
		this.term.grabInput( { mouse: 'button' } ) ;
		this.term.on( 'key' , ( name , matches , data ) => {
			this.handle_key_press_event(name,data)
		}) ;
        this.textBuffer.moveTo(0,0);
        this.screenBuffer.moveTo(0,0);
        this.draw_cursor();
		let init_state = new SnapShotLinkedListNode();
		this.TextEditorStateManagementLinkList = new TextEditorStateManagementLinkList(init_state,this);
        this.draw();

	}

    log_cur_location() {
        this.term.getCursorLocation((err, x, y) => console.log(x, y));
    }


	handle_key_press_event(name, data) {
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
			// case 'ENTER':
			// 	this.textBuffer.newLine();
			// 	break;

			// case 'TAB':
			// 	this.new_char('\t');    
			// 	break;
			// case 'HOME':
			// 	this.textBuffer.moveToColumn(0);
			// 	break;
			// case 'END':
			// 	this.textBuffer.moveToEndOfLine();
			// 	break;
			default:
				if (data.isCharacter) {
					this.new_char(name);
				}
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

	new_char(char) {
		let appendCommand = create_Command({"command_type": "text","text":char});
		let node = new SnapShotLinkedListNode(appendCommand);
		this.insert_and_execute(node);		
	}

    openfile(file_name, open_mode) {
		
    }

    draw(){
    	this.textBuffer.draw();
        this.screenBuffer.draw({
            delta: true
        });
    }

    terminate() {
    	this.term.clear();
    	this.term.moveTo(0,0);
		this.term.grabInput( false ) ;
		setTimeout( function() { process.exit() } , 100 ) ;
	}
}

export default TextEditor;