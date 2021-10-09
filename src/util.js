import {AppendCommand, DeleteCommand, SpaceCommand, TextCommand} from './commandPattern.js'

export function create_Command(command_obj) {
    if (command_obj.command_type == "append") {
        return new AppendCommand();
    }
    if (command_obj.command_type == "space") {
        return new SpaceCommand();
    }
    if (command_obj.command_type == "text") {
        return new TextCommand(command_obj.text);
    }
}

export function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}

