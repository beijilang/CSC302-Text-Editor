import { create_Command } from './util.js';
import termKit from 'terminal-kit';
import * as fs from 'fs';
import {SnapShotLinkedListNode, TextEditorStateManagementLinkList} from './ObjectState.js'
import { timingSafeEqual } from 'crypto';
import { timeStamp } from 'console';

class TextEditor {
    constructor(input_parameter = {}) {
        this.term = termKit.terminal;
		this.customized_shortcut = new Map();
		this.available_functionality = ['REDO','UNDO','SAVE','HEAD_OF_LINE','END_OF_LINE','BACK_DELETE','TAB','SAVE_AS','COMMAND','TERMINATE','NEXT_LINE','UP','DOWN','RIGHT','LEFT','SHOW_MAPPING']
		
        this.screenBuffer = new termKit.ScreenBuffer({
			dst: this.term,
			height: this.term.height - 3,
			y: 2
		});

		this.textBuffer = new termKit.TextBuffer({
			dst: this.screenBuffer
		})

		this.tmpTextBuffer = new termKit.TextBuffer({
			dst: this.screenBuffer
		})
		this.commandPrompt = false;
		this.displayMode = false;
		this.inputMode = "";
		this.updateFunction = "";
    }

	onResize(width, height) {
		this.screenBuffer.resize({
			x: 0,
			y: 2,
			width: width,
			height: height - 2
		});
		this.drawBar({x:1, y:1},'Hit CTRL-C to quit.\n\n');
		this.draw_cursor();
	}


    draw_cursor() {
		this.textBuffer.draw();
		this.screenBuffer.draw({
			delta: true
		});
		this.textBuffer.drawCursor();
		this.screenBuffer.drawCursor();
    }

	drawBar(pos, message) {
		this.term.moveTo(pos.x, pos.y).green(' ' + message);
	}

	draw_command_prompt(defaultString, callback){
		this.commandPrompt = true;
		let inputParameters = {
			cancelable: true,
			x: 0,
			y: this.term.height,
			default: defaultString
		}
		this.term.inputField(inputParameters, (error, input)=>{
			if(error){
				this.term.red("errror");
			}
			else{
				callback(input)
				this.commandPrompt = false;
				this.clear_prompt()
			}
		})
	}
	

	clear_prompt(){
		this.term.moveTo(0, this.term.height).eraseLine();
		this.draw_cursor();
	}

	// Init a blank terminal for write
	init(file) {
        this.term.clear();
		this.term.grabInput( { mouse: 'button' } ) ;
		this.term.green( 'Hit CTRL-C to quit.\n\n' );
		this.term.on( 'key' , ( name , matches , data ) => {
			if(!this.commandPrompt){
				this.handle_key_press_event(name,data)
			}
		}) ;
		this.term.on('resize', (width, height) => this.onResize(width, height));
        this.textBuffer.moveTo(0,0);
        this.screenBuffer.moveTo(0,0);
        this.draw_cursor();
		this.filePath = file;
		this.load_file(file);
		this.default_mapping = [{"key":"CTRL_Z","func":"UNDO"},{"key":"CTRL_S","func":"SAVE"},{"key":"CTRL_C","func":"TERMINATE"},{"key":"CTRL_Y","func":"REDO"},{"key":"ENTER","func":"NEXT_LINE"},{"key":"UP","func":"UP"},{"key":"DOWN","func":"DOWN"},{"key":"LEFT","func":"LEFT"},{"key":"RIGHT","func":"RIGHT"},{"key":"HOME","func":"HEAD_OF_LINE"},{"key":"END","func":"END_OF_LINE"},{"key":"BACKSPACE","func":"BACK_DELETE"},{"key":"TAB","func":"TAB"},{"key":"CTRL_A","func":"SAVE_AS"},{"key":"CTRL_T","func":"COMMAND"},{"key":"CTRL_Q","func":"SHOW_MAPPING"}];

		try {
			this.shortcut_file=fs.readFileSync('../src/customization_shortcut.json', 'utf8');
		}catch(error){
			if (error.code === 'ENOENT') {
				const data = JSON.stringify(this.default_mapping);
				fs.writeFileSync('../src/customization_shortcut.json', data);
				this.shortcut_file=fs.readFileSync('../src/customization_shortcut.json', 'utf8');
			  } else {
				throw err;
			  }
		}
		
		this.shortcuts=JSON.parse(this.shortcut_file);
		for (var i of this.shortcuts){
			this.customized_shortcut.set(i['key'],i['func']);
		}

		let init_state = new SnapShotLinkedListNode();
		this.TextEditorStateManagementLinkList = new TextEditorStateManagementLinkList(init_state,this);

	}

	load_file(file, encoding='utf8', mode="w"){
		if(file != null){
			try{
				// Create new State Management Link List after opening a new file
				// Create new text buffer for the current screen buffer
				let text = fs.readFileSync(file, encoding, mode);
				this.textBuffer = new termKit.TextBuffer({
					dst: this.screenBuffer
				})
				this.textBuffer.setText(text);
				this.textBuffer.moveToEndOfBuffer();
				let init_state = new SnapShotLinkedListNode();
				this.TextEditorStateManagementLinkList = new TextEditorStateManagementLinkList(init_state,this);
				this.filePath = file
			}
			catch(e){
				//TODO: Add error check
				// this.term.red("something went wrong");
			}
		}

	}

	save_file(){
		try{
			fs.writeFileSync(this.filePath, this.textBuffer.getText());
		}
		catch(e){
			//TODO:: Add error check
			// this.term.red("Something went wrong");
		}
	}

	// This is just a temp method for logging out something went wrong.
	warning_tmp(){
	}

	set_shortcut(key,func){
		if(!this.available_functionality.includes(func)){
			var text = func + " functionality is not supported\n";
			this.set_display_mode(text);
			return;
		}
		
			
		for (var i = 0; i < this.shortcuts.length; ++i) {
			if (this.shortcuts[i]['key'] === key) {
				this.shortcuts[i]['key'] = undefined;
				break;
			}
			
		}
		
		for (var i = 0; i < this.shortcuts.length; ++i) {
			if (this.shortcuts[i]['func'] === func) {
				this.customized_shortcut.delete(this.shortcuts[i]['key']);
				this.shortcuts[i]['key'] = key;
				break;
			}
			
		}
		this.customized_shortcut.delete(key);
		this.customized_shortcut.set(key, func);
		
		const data = JSON.stringify(this.shortcuts);
		fs.writeFileSync('../src/customization_shortcut.json', data);
	}

	reset_shortcuts(){
		const data = JSON.stringify(this.default_mapping);
		fs.writeFileSync('../src/customization_shortcut.json', data);
		this.shortcut_file=fs.readFileSync('../src/customization_shortcut.json', 'utf8');

		this.shortcuts=JSON.parse(this.shortcut_file);
		for (var i of this.shortcuts){
			this.customized_shortcut.set(i['key'],i['func']);
		}
	}


	handle_key_press_event(name, data) {
		if(this.displayMode === true){
			this.textBuffer.setText(this.tmpTextBuffer.getText());
			this.displayMode = false;
			this.draw_cursor();
			return;
		}

		if(this.inputMode === "update_shortcut"){
			console.log("A")
			if (!data.isCharacter){
				this.set_shortcut(name, this.updateFunction);
				this.textBuffer.setText(this.tmpTextBuffer.getText());
				this.inputMode = "";
				this.draw_cursor();
				return;
			}
		}
		if (!data.isCharacter){
			name = this.customized_shortcut.get(name);
		}
		switch(name) {
			case "BACK_DELETE":
				this.backspace();
				break;
			case "SAVE":
				if(this.filePath != null){this.save_file();}
				break;
			case "SAVE_AS":
				this.draw_command_prompt("Save File As:", (input)=>{
					this.filePath = input.replace("Save File As:", "");
					this.save_file();
				})
				break;
			case "COMMAND":
				this.draw_command_prompt(":", (input)=>{
					this.execute_command(input)
				});
				break;
			case "TERMINATE":
				this.terminate();
				break;
			case "UNDO":
				this.undo();
				break;
			case "REDO":
				this.redo();
				break;
			case 'NEXT_LINE':
				this.enter();
				break;
			case 'TAB':
				this.tab();
				break;
			case 'HEAD_OF_LINE':
				this.textBuffer.moveToColumn(0);
				this.draw_cursor();
				break;
			case 'END_OF_LINE':
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
			case 'SHOW_MAPPING':
				var mapping = "";
				for (var i of this.shortcuts){
					mapping += i['key'] + ' : '+ i['func'] + '\n';
				}
				
				this.set_display_mode(mapping);
			default:
				if (data.isCharacter) {
					this.new_char(name);
				}
                break;
		}
	}

	set_input_mode(text, mode){
		
		this.tmpTextBuffer.setText(this.textBuffer.getText());
		
		this.textBuffer.setText(text);
		this.inputMode = mode;
		this.draw_cursor();
	}

	set_display_mode(text){
		text += "Press any key to return";
		this.tmpTextBuffer.setText(this.textBuffer.getText());
		
		this.textBuffer.setText(text);
		this.displayMode = true;
		this.draw_cursor();
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

	execute_command(input){
		if(input != null){
			input = input.substring(1)
			
			let args = input.split(" ");
			let command = args[0]
			if(command == "open"){
				this.load_file(args[1])
			}
			else if(command == "save"){
				if(args.length > 1){
					this.filePath = args[1]
				}
				this.save_file();
			}else if(command == "change_shortcut"){
				if(args.length > 2){
					var key = args[1];
					var func = args[2];
					this.set_shortcut(key,func);
				}
			}else if (command == "update_shortcut"){
				if(args.length > 1){
					this.inputMode = "update_shortcut";
					this.updateFunction = args[1];
					this.set_input_mode("Press a non-character key to update shortcut","update_shortcut");
				}
			}
			else if(command == "reset_shortcuts"){
				this.reset_shortcuts();
			}
		}



	}
   

    terminate() {
    	this.term.clear();
    	this.term.moveTo(0,0);
		this.term.grabInput( false ) ;
		setTimeout( function() { process.exit() } , 100 ) ;
	}
}

export default TextEditor;
