import { create_Command } from './util.js';
import termKit from 'terminal-kit';
import * as fs from 'fs';
import {SnapShotLinkedListNode, TextEditorStateManagementLinkList} from './ObjectState.js'
import { timingSafeEqual } from 'crypto';

class TextEditor {
    constructor(input_parameter = {}) {
        this.term = termKit.terminal;

        this.screenBuffer = new termKit.ScreenBuffer({
			dst: this.term,
			height: this.term.height - 3,
			y: 2
		});

		this.textBuffer = new termKit.TextBuffer({
			dst: this.screenBuffer
		})
		this.commandPrompt = false;
    }


    draw_cursor() {
		this.textBuffer.draw();
		this.screenBuffer.draw({
			delta: true
		});
		this.textBuffer.drawCursor();
		this.screenBuffer.drawCursor();
    }

	draw_command_prompt(){
		this.commandPrompt = true;
		let inputParameters = {
			cancelable: true,
			x: 0,
			y: this.term.height,
			default: ":"
		}
		this.term.fileInput(inputParameters, (error, input)=>{
			if(error){
				this.term.red("errror");
			}
			else{
				this.term.green("Test");
				this.commandPrompt = false;
				this.clear_prompt()
			}
		})
	}
	clear_prompt(){
		let x = this.screenBuffer.x;
		let y = this.screenBuffer.y;
		this.term.moveTo(0, this.term.height).eraseLine();
		this.draw_cursor();
	}

	// Init a blank terminal for write
	init(file) {
        this.term.clear();
		this.term.green( 'Hit CTRL-C to quit.\n\n' ) ;
		this.term.grabInput( { mouse: 'button' } ) ;
		this.term.on( 'key' , ( name , matches , data ) => {
			if(!this.commandPrompt){
				this.handle_key_press_event(name,data)
			}
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
				this.backspace();
				break;
			case "CTRL_S":
				if(this.file != null){this.draw_command_prompt();}
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
				this.enter();
				break;
			case 'TAB':
				this.tab();
				break;
			case 'HOME':
				this.textBuffer.moveToColumn(0);
				this.draw_cursor();
				break;
			case 'END':
				this.textBuffer.moveToEndOfLine();
				this.draw_cursor();
				break;
			case 'UP':
				if (this.textBuffer.cy == 0) {
					return;
				}
				else {
					// Move curosr [vertical offset, horizontal offset]
					this.move_cursor([0, -1]);
				}
				break;
			case 'DOWN':
				// If at last line just return
				if (this.textBuffer.cy == this.textBuffer.buffer.length - 1) {
					return;
				} 
				else {
					this.move_cursor([0, 1]);
				}
				break;
			case 'LEFT':
				if (this.textBuffer.cy == 0 && this.textBuffer.cx == 0) {
					return;
				}
				else {
					this.move_cursor([-1, 0]);
				}
				break;
			case 'RIGHT':
				if (this.textBuffer.cy == this.textBuffer.buffer.length - 1 && this.textBuffer.cx == (this.textBuffer.buffer[this.textBuffer.buffer.length - 1].length)) {
					return;  
				}
				else {
					this.move_cursor([1, 0]);	
				}
			default:
				if (data.isCharacter) {
					this.new_char(name);
				}
                break;
		}
	}

	get_char_at_location(x, y) {
		if (x == 0) {
			let last_index = this.textBuffer.buffer[y - 1].length - 1
			return this.textBuffer.buffer[y - 1][last_index];
		}
		else {
			return this.textBuffer.buffer[y][x-1];
		}
	}

	restore_cusor_location_to_undo(command_node) {
		this.textBuffer.moveTo(command_node.undo_x, command_node.undo_y);
		this.draw_cursor();
	}

	restore_cusor_location_to_redo(command_node) {
		this.textBuffer.moveTo(command_node.x, command_node.y);
		this.draw_cursor();
	}

	undo_command() {
		this.restore_cusor_location_to_undo(this.TextEditorStateManagementLinkList.get_cur_node().command_obj);
		this.TextEditorStateManagementLinkList.get_cur_node().command_obj.redo(this)
	}

	redo_command() {
		this.restore_cusor_location_to_redo(this.TextEditorStateManagementLinkList.get_cur_node().command_obj);
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

	backspace() {
		/* Check Cursor Location First */
		if (this.textBuffer.cx == 0 && this.textBuffer.cy == 0) {
			return;
		}
		else {
			let DeleteCommand = create_Command({"command_type": "delete", "x": this.textBuffer.cx, "y": this.textBuffer.cy});
			let node = new SnapShotLinkedListNode(DeleteCommand);
			this.insert_and_execute(node);
		}
	}

	new_char(char) {
		let appendCommand = create_Command({"command_type": "text","text":char, "x": this.textBuffer.cx, "y":  this.textBuffer.cy});
		let node = new SnapShotLinkedListNode(appendCommand);
		this.insert_and_execute(node);
	}

	enter() {
		let appendCommand = create_Command({"command_type": "enter", "x": this.textBuffer.cx, "y": this.textBuffer.cy});
		let node = new SnapShotLinkedListNode(appendCommand);
		this.insert_and_execute(node);
	}
	
	tab() {
		let appendCommand = create_Command({"command_type": "tab", "x": this.textBuffer.cx, "y": this.textBuffer.cy});
		let node = new SnapShotLinkedListNode(appendCommand);
		this.insert_and_execute(node);
	}

	move_cursor(offset) {
		this.textBuffer.move(offset[0], offset[1]);
		// According to the design, it is impossible for the cursor to extend the length of textbuffer.buffer.
		// But it is possible for cx to extend the range of the array, detect this here
		if (this.textBuffer.cx >= this.textBuffer.buffer[this.textBuffer.cy].length) {
			this.textBuffer.moveToEndOfLine();
		}
		this.draw_cursor();
	}

   

    terminate() {
    	this.term.clear();
    	this.term.moveTo(0,0);
		this.term.grabInput( false ) ;
		setTimeout( function() { process.exit() } , 100 ) ;
	}
}

export default TextEditor;
