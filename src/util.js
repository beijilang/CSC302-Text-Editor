import {AppendCommand, DeleteCommand, SpaceCommand, TextCommand, EnterCommand,TabCommand} from './commandPattern.js'

export function create_Command(command_obj) {
    if (command_obj.command_type == "append") {
        return new AppendCommand();
    }
    if (command_obj.command_type == "space") {
        return new SpaceCommand();
    }
    if (command_obj.command_type == "text") {
        return new TextCommand(command_obj.text, command_obj.x, command_obj.y);
    }
    if (command_obj.command_type == "enter") {
        return new EnterCommand(command_obj.x, command_obj.y);
    }
    if (command_obj.command_type == "tab") {
        return new TabCommand(command_obj.x, command_obj.y);
    }
    if (command_obj.command_type == "delete") {
        return new DeleteCommand(command_obj.x, command_obj.y);
    }

}

export function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}

