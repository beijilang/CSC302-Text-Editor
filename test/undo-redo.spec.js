import fs from "fs";
import pty from "node-pty";
import { SnapShotLinkedListNode, TextEditorStateManagementLinkList } from "../src/ObjectState";

describe("Command linked list (in-process)", () => {
    test("node constructor", () => {
        const node = new SnapShotLinkedListNode();
        expect(node.previous).toBeNull();
        expect(node.next).toBeNull();
    });
    test("list constructor", () => {
        const list = new TextEditorStateManagementLinkList(null, null);
        expect(list.get_cur_node()).toBeNull();
    });
    test("sequential insert", () => {
        const one = new SnapShotLinkedListNode();
        const two = new SnapShotLinkedListNode();
        const three = new SnapShotLinkedListNode();
        const list = new TextEditorStateManagementLinkList(one, null);
        list.insertNewState(two);
        list.insertNewState(three);
        expect(list.get_cur_node()).toBe(three);
        expect(list.get_last_action()).toBe(two);
        expect(list.get_next_action()).toBeNull();
        expect(one.previous).toBeNull();
        expect(one.next).toBe(two);
        expect(two.previous).toBe(one);
        expect(two.next).toBe(three);
        expect(three.previous).toBe(two);
        expect(three.next).toBeNull();
    })
    test("traverse history", () => {
        const head = new SnapShotLinkedListNode();
        const undone = new SnapShotLinkedListNode();
        const replacement = new SnapShotLinkedListNode();
        const list = new TextEditorStateManagementLinkList(head, null);
        list.insertNewState(undone);
        expect(list.get_cur_node()).toBe(undone);
        list.move_cur_node_to_left();
        expect(list.get_cur_node()).toBe(head);
        expect(list.get_next_action()).toBe(undone);
        list.move_cursor_to_right();
        expect(list.get_cur_node()).toBe(undone);
        expect(list.get_next_action()).toBeNull();
        list.move_cur_node_to_left();
        list.insertNewState(replacement);
        expect(list.get_cur_node()).toBe(replacement);
        expect(list.get_last_action()).toBe(head);
        expect(list.get_next_action()).toBeNull();
    });
});

const sleep = interval => new Promise(resolve => setTimeout(resolve, interval));
const result = () => fs.readFileSync("undo.txt", { encoding: "utf8" });

describe("Undo and redo (pseudo-TTY child process)", () => {
    let process;
    beforeEach(async () => {
        fs.writeFileSync("undo.txt", "");
        process = pty.spawn("node", ["src", "undo.txt"]);
        await sleep(400);
    });
    afterEach(() => {
        process.kill();
    });
    test("example 1", async () => {
        expect.assertions(1);
        process.write("123456\x1A\x1A\x19\x13\x03"); // Ctrl+Z, Ctrl+Z, Ctrl+Y, Ctrl+S, Ctrl+C
        await sleep(400);
        expect(result()).toEqual("12345");
    });
    test("example 2", async () => {
        expect.assertions(1);
        process.write("123456\x1A\x1A7\x1A\x19\x13\x03"); // Ctrl+Z, Ctrl+Z, 7, Ctrl+Z, Ctrl+Y, Ctrl+S, Ctrl+C
        await sleep(400);
        expect(result()).toEqual("12347");
    });
});
