import {assert} from './util'

class TextEditorSnapShot {
    constructor(text_content) {
        this.text = text_content;
    }
}

class SnapShotLinkedListNode {
    constructor(textEditorSnapShotObject) {
        this.data = textEditorSnapShotObject;
        this.next = NULL;
        this.previous = NULL;
    }
}

class TextEditorStateManagementLinkList {
    constructor(textEditorSnapShotObjectHead) {
        this.cur_node = textEditorSnapShotObjectHead;
    }

    error_check() {
        if (this.cur_node == NULL) {
            assert(false, "TAIL AND HEAD EMPTY")
        }
    }

    // Text editor update, initialze a new state
    insertNewState(textEditorSnapShotNode) {
        error_check();
        this.cur_node.next = textEditorSnapShotNode;
        this.cur_node = this.cur_node.next;
    }

    get_cur_node() {
        return this.cur_node;
    }

    // Return the previous Node, should call this before applying redo, if returns NULL, meaning there is no change.
    get_last_action() {
        return this.cur_node.previous;
    }

    // Apply the redo Action.
    redo_action() {
        if (this.cur_node.previous == NULL) {
            assert(false, "Can not REDO, previous state is EMPTY");
        }
        else{
            this.cur_node = this.cur_node.previous;
        }
    }

    // Return the next Node, should dcall this before applying undo, if returns NULL, meaning this is the most recent change
    get_next_action() {
        return this.cur_node.next;
    }

    undo_action() {
        if (this.cur_node.next = NULL) {
            assert(false, "Can not UNDO, next state is empty");
        }
        else {
            this.cur_node = this.cur_node.next;
        }
    }
}


