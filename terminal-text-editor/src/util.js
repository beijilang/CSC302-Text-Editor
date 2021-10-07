import {AppendCommand, DeleteCommand} from './commandPattern.js'

export function create_Command(command_obj) {
    if (command_obj.command_type == "append") {
        return new AppendCommand();
    }
}

export function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}

