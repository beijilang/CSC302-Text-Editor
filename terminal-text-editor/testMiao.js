import termKit from 'terminal-kit';
var term = termKit.terminal ;

// var items = [ 'File' , 'Edit' , 'View' , 'History' , 'Bookmarks' , 'Tools' , 'Help' ] ;

// var options = {
// 	y: 1 ,	// the menu will be on the top of the terminal
// 	style: term.inverse ,
// 	selectedStyle: term.dim.blue.bgGreen
// } ;

// term.clear() ;

// function question() {
// 	term( 'Do you like javascript? [Y|n]\n' ) ;
	
// 	// Exit on y and ENTER key
// 	// Ask again on n
// 	term.yesOrNo( { yes: [ 'y' , 'ENTER' ] , no: [ 'n' ] } , function( error , result ) {
	
// 		if ( result ) {
// 			term.green( "'Yes' detected! Good bye!\n" ) ;
// 			process.exit() ;
// 		}
// 		else {
// 			term.red( "'No' detected, are you sure?\n" ) ;
// 			question() ;
// 		}
// 	} ) ;
// }

// // question() ;


// term.singleLineMenu( items , options , function( error , response ) {
// 	term( '\n' ).eraseLineAfter.green(
// 		"#%s selected: %s (%s,%s)\n" ,
// 		response.selectedIndex ,
// 		response.selectedText ,
// 		response.x ,
// 		response.y
// 	) ;
// 	process.exit() ;
// } ) ;
import TextEditor from "./index.js";

const editor = new TextEditor();
editor.start();
editor.test();


// function terminate() {
// 	term.grabInput( false ) ;
// 	setTimeout( function() { process.exit() } , 100 ) ;
// }

// term.bold.cyan( 'Type anything on the keyboard...\n' ) ;
// term.green( 'Hit CTRL-C to quit.\n\n' ) ;

// term.grabInput( { mouse: 'button' } ) ;

// term.on( 'key' , function( name , matches , data ) {
// 	console.log( "'key' event:" , name ) ;
// 	if ( name === 'CTRL_C' ) { terminate() ; }
// } ) ;

// term.on( 'terminal' , function( name , data ) {
// 	console.log( "'terminal' event:" , name , data ) ;
// } ) ;

// term.on( 'mouse' , function( name , data ) {
// 	console.log( "'mouse' event:" , name , data ) ;
// } ) ;