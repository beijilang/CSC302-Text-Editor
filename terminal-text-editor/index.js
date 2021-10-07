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
    }

 //    terminate() {
	// 	term.grabInput( false ) ;
	// 	setTimeout( function() { process.exit() } , 100 ) ;
	// }

    // Open a file using the library
    openfile(file_name, open_mode) {

    }

    start(){
    	this.term.clear();
    }

    test(){
    	this.term.bold.cyan( 'Type anything on the keyboard...\n' ) ;
		this.term.green( 'Hit CTRL-C to quit.\n\n' ) ;

		this.term.grabInput( { mouse: 'button' } ) ;

		this.term.on( 'key' , ( name ,matches, data ) => {
			console.log( "'key' event:" , name ) ;
			if ( name === 'CTRL_C' ) { terminate() ; }
		} ) ;

		this.term.on( 'terminal' , ( name , data ) => {
			console.log( "'terminal' event:" , name , data ) ;
		} ) ;

		this.term.on( 'mouse' , ( name , data ) => {
			console.log( "'mouse' event:" , name , data ) ;
		} ) ;
    }

    terminate() {
		this.term.grabInput( false ) ;
		setTimeout( function() { process.exit() } , 100 ) ;
	}

}

export default TextEditor;