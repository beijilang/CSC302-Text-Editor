import {AppendCommand, DeleteCommand} from './commandPattern.js'

export function create_Command(command_type) {
    return new AppendCommand();
}

export function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}

