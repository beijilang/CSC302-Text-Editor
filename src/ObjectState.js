import { assert } from "./util.js";

class SnapShotLinkedListNode {
    constructor(textEditorCommandObject = null) {
        this.command_obj = textEditorCommandObject;
        this.next = null;
        this.previous = null;
    }
}

class TextEditorStateManagementLinkList {
    constructor(textEditorSnapShotObjectHead, textEditor) {
        // Empty Text Editor, Should Init with empty
        this.cur_node = textEditorSnapShotObjectHead;
        this.textEditor = textEditor;
    }

    error_check() {
        if (this.cur_node == null) {
            assert(false, "TAIL AND HEAD EMPTY");
        }
    }

    // Text editor update, initialze a new state
    insertNewState(textEditorSnapShotNode) {
        this.error_check();
        this.cur_node.next = textEditorSnapShotNode;
        textEditorSnapShotNode.previous = this.cur_node;
        this.cur_node = this.cur_node.next;
    }

    get_cur_node() {
        return this.cur_node;
    }

    // Return the previous Node, should call this before applying undo, if returns NULL, meaning there is no change.
    get_last_action() {
        return this.cur_node.previous;
    }

    move_cur_node_to_left() {
        if (this.cur_node.previous == null) {
            assert(false, "prev is null");
        }
        this.cur_node = this.cur_node.previous;
    }

    move_cursor_to_right() {
        if (this.cur_node.next == null) {
            assert(false, "next is null");
        }
        this.cur_node = this.cur_node.next;
    }

    // Return the next Node, should dcall this before applying undo, if returns NULL, meaning this is the most recent change
    get_next_action() {
        return this.cur_node.next;
    }

    // Apply the redo Action.
}

export { SnapShotLinkedListNode, TextEditorStateManagementLinkList };
