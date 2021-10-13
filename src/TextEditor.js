import { create_Command } from './util.js';
import termKit from 'terminal-kit';
import * as fs from 'fs';
import {SnapShotLinkedListNode, TextEditorStateManagementLinkList} from './ObjectState.js'

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
	init(file) {
        this.term.clear();
		this.term.green( 'Hit CTRL-C to quit.\n\n' ) ;
		this.term.grabInput( { mouse: 'button' } ) ;
		this.term.on( 'key' , ( name , matches , data ) => {
			this.handle_key_press_event(name,data)
		}) ;
        this.textBuffer.moveTo(0,0);
        this.screenBuffer.moveTo(0,0);
        this.draw_cursor();
		this.file = file;
		this.load_file(file)
		let init_state = new SnapShotLinkedListNode();
		this.TextEditorStateManagementLinkList = new TextEditorStateManagementLinkList(init_state,this);

	}

	load_file(file, encoding='utf8', mode="w"){
		try{
			let text = fs.readFileSync(file, encoding, mode);
			this.textBuffer.insert(text);
		}
		catch(e){
			//TODO: Add error check
			// this.term.red("something went wrong");
		}
	}

	save_file(){
		try{
			fs.writeFileSync(this.file, this.textBuffer.getText());
			this.term.green("\nFile Saved!");
		}
		catch(e){
			//TODO:: Add error check
			// this.term.red("Something went wrong");
		}
	}

	// This is just a temp method for logging out something went wrong.
	warning_tmp(){
	}

    log_cur_location() {
        this.term.getCursorLocation((err, x, y) => console.log(x, y));
    }


	handle_key_press_event(name, data) {
		switch(name) {
			case " ":
				this.move_cursor_to_right();
				break;
			// case "BACKSPACE":
				// this.move_cursor_to_left();
				// break;
                // this.display_terminal_text_content();
                break;
			case "CTRL_S":
				if(this.file != null){this.save_file();}
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
			case 'ENTER':
				this.new_char('\n');
				break;

			case 'TAB':
				this.new_char('\t');
				break;
			case 'HOME':
				this.textBuffer.moveToColumn(0);
				
				break;
			case 'END':
				this.textBuffer.moveToEndOfLine();
				break;

			case 'UP':
				this.textBuffer.moveUp();
				if (typeof this.textBuffer.buffer[this.textBuffer.cy] !== 'undefined' && this.textBuffer.cx > this.textBuffer.buffer[this.textBuffer.cy].length - 1) {
					this.textBuffer.moveToEndOfLine();
				}
				break;
			case 'DOWN':
				this.textBuffer.moveDown();
	
				if (typeof this.textBuffer.buffer[this.textBuffer.cy] !== 'undefined' && this.textBuffer.cx > this.textBuffer.buffer[this.textBuffer.cy].length - 1) {
					this.textBuffer.moveToEndOfLine();
				}
				break;
				
			case 'LEFT':
				this.textBuffer.moveBackward();
			case 'RIGHT':
				
				this.textBuffer.moveRight();
			default:
				if (data.isCharacter) {
					this.new_char(name);
				}
                break;
		}
		this.draw_cursor();
	}

    display_terminal_text_content() {
        // console.log("The text is ", this.textBuffer.getText());
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

   

    terminate() {
    	this.term.clear();
    	this.term.moveTo(0,0);
		this.term.grabInput( false ) ;
		setTimeout( function() { process.exit() } , 100 ) ;
	}
}

export default TextEditor;
