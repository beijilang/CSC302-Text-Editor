class Command {
    constructor() {

    }

    execute() {

    }

    redo() {
        // What operation will be applied to add this change
    }
}

// Initialize class that has the same structure as the above to make changes. For exmaple, when appending, should Init AppendCommand,
// And initialize it with the append index and content;

class AppendCommand {
    constructor(append_index, append_content) {
        this.append_index = append_index;
        this.append_content = append_content;
    }
    execute() {
        // Call Execute to make changes
    }

    redo() {
        // Call it to undo the executed change
    }
}

class DeleteCommand {
    constructor(delete_index, delete_num) {
        this.delete_index = delete_index;
        this.delete_num = delete_num;
    }

    execute() {
        // Call execute to delete
    }

    redo() {
        // Call 
    }
}






// Call export here
module.exports.append_com = AppendCommand;
module.exports.delete_com = DeleteCommand;