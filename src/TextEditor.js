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

	/* Credit: TermIt https://github.com/hakash/termit*/
	update_Cursor() {

		let new_buffer_x = this.textBuffer.x;
		let new_buffer_y = this.textBuffer.y;

		if (this.textBuffer.x < -this.textBuffer.cx) {
			new_buffer_x = Math.min(0, -this.textBuffer.cx + Math.floor(this.screenBuffer.width / 2));
		} else if (this.textBuffer.x > -this.textBuffer.cx + this.screenBuffer.width - 1) {
			new_buffer_x = (this.screenBuffer.width / 2) - this.textBuffer.cx;
		}

		if (this.textBuffer.y < -this.textBuffer.cy) {
			new_buffer_y = Math.min(0, -this.textBuffer.cy + Math.floor(this.screenBuffer.height / 2));
		} else if (this.textBuffer.y > -this.textBuffer.cy + this.screenBuffer.height - 1) {
			new_buffer_y = (this.screenBuffer.height / 2) - this.textBuffer.cy;
		}

		if (new_buffer_y != this.textBuffer.y || new_buffer_x != this.textBuffer.x) {
			this.textBuffer.x = new_buffer_x;
			this.textBuffer.y = new_buffer_y;
			this.textBuffer.draw();
			this.screenBuffer.draw({
				delta: true
			});
		}
		this.textBuffer.drawCursor();
		this.screenBuffer.drawCursor();
	}

    draw_cursor() {
		this.textBuffer.draw();
		this.screenBuffer.draw({
			delta: true
		});
		// this.textBuffer.drawCursor();
		// this.screenBuffer.drawCursor();
		this.update_Cursor();
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


	handle_key_press_event(name, data) {
		switch(name) {
			case "BACKSPACE":
				this.move_cursor_to_left();
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
			// case 'ENTER':
			// 	this.enter();
			// 	break;
			// case 'TAB':
			// 	this.tab();
			// 	break;
			case 'HOME':
				this.textBuffer.moveToColumn(0);
				break;
			case 'END':
				this.textBuffer.moveToEndOfLine();
				break;
			// case 'UP':
			// 	this.textBuffer.moveUp();
			// 	if (typeof this.textBuffer.buffer[this.textBuffer.cy] !== 'undefined' && this.textBuffer.cx > this.textBuffer.buffer[this.textBuffer.cy].length - 1) {
			// 		this.textBuffer.moveToEndOfLine();
			// 	}
			// 	this.draw_cursor();
			// 	break;
			// case 'DOWN':
			// 	this.textBuffer.moveDown();
			// 	if (typeof this.textBuffer.buffer[this.textBuffer.cy] !== 'undefined' && this.textBuffer.cx > this.textBuffer.buffer[this.textBuffer.cy].length - 1) {
			// 		this.textBuffer.moveToEndOfLine();
			// 	}
			// 	this.draw_cursor();
			// 	break;
			// case 'LEFT':
			// 	this.textBuffer.moveBackward();
			// 	this.draw_cursor();
			// 	break;
			// case 'RIGHT':
			// 	this.textBuffer.moveRight();
			// 	this.draw_cursor();
			// 	break;
			default:
				if (data.isCharacter) {
					this.new_char(name);
				}
                break;
		}
	}

	get_char_at_location(x, y) {
		if (x == 1) {
			// we are at the begining of a line;
			if (y == 2) {
				return {}
			}
			else {
				let obj_arr = this.textBuffer.buffer[y - 3];
				return obj_arr[obj_arr.length - 1];
			}
		}
		else {
			return this.textBuffer.buffer[y - 2][x - 2];
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
			return;
		}
		this.undo_command();
		this.TextEditorStateManagementLinkList.move_cur_node_to_left();
	}

	redo() {
		let next_state = this.TextEditorStateManagementLinkList.get_next_action();
		if (next_state == null) {
			return;
		}
		this.TextEditorStateManagementLinkList.move_cursor_to_right();
		this.redo_command()
	}

	write_to_log(cont) {
		fs.appendFile("./test.log", cont, function(err) {
			if(err) {
				return console.log(err);
			}
		}); 
	}

	move_cursor_to_left() {
		/* Check Cursor Location First */
		this.term.getCursorLocation((error, x, y) => {
			if (x == 1 && y == 2) {
				// At the top of the screen
				return;
			}
			else {
				let DeleteCommand;
				if (x == 1) {
					DeleteCommand = create_Command({"command_type": "delete", "x": x, "y": y});
				}
				else {
					DeleteCommand = create_Command({"command_type": "delete", "x": x, "y": y});
				}
				let node = new SnapShotLinkedListNode(DeleteCommand);
				this.insert_and_execute(node);
			}
        });
	}

	new_char(char) {
		let appendCommand = create_Command({"command_type": "text","text":char, "x": this.textBuffer.cx, "y":  this.textBuffer.cy});
		let node = new SnapShotLinkedListNode(appendCommand);
		this.insert_and_execute(node);
	}

	// enter() {
	// 	let appendCommand = create_Command({"command_type": "enter", "x": this.textBuffer.cx, "y": this.textBuffer.cy});
	// 	let node = new SnapShotLinkedListNode(appendCommand);
	// 	this.insert_and_execute(node);
	// }
	
	// tab() {
	// 	this.term.getCursorLocation((error, x, y) => {
	// 		let appendCommand = create_Command({"command_type": "tab", "x": x, "y": y});
	// 		let node = new SnapShotLinkedListNode(appendCommand);
	// 		this.insert_and_execute(node);
    //     })
	// }

   

    terminate() {
    	this.term.clear();
    	this.term.moveTo(0,0);
		this.term.grabInput( false ) ;
		setTimeout( function() { process.exit() } , 100 ) ;
	}
}

export default TextEditor;
