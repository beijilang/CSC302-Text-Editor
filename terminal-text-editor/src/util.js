import {AppendCommand, DeleteCommand, SpaceCommand} from './commandPattern.js'

export function create_Command(command_obj) {
    if (command_obj.command_type == "append") {
        return new AppendCommand();
    }
    if (command_obj.command_type == "space") {
        return new SpaceCommand();
    }
}

export function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}

