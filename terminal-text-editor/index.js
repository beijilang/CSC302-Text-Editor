let allCommands = require("./commandPattern")

let appendCommandClass = allCommands.append_com;
let deleteCommandClass = allCommands.delete_com;

function create_Command(command_type) {
    return new appendCommandClass();
}

var term = require( 'terminal-kit' ).terminal ;

term( 'Hello world!\n' ) ;










