import fs from "fs";
import pty from "node-pty";

const sleep = interval => new Promise(resolve => setTimeout(resolve, interval));
const result = () => fs.readFileSync("test.txt", { encoding: "utf8" });

describe("Opens and save a file (pseudo-TTY child process)", () => {
    let process;
    beforeEach(async () => {
        fs.writeFileSync("test.txt", "");
        process = pty.spawn("node", ["src", "test.txt"]);
        await sleep(400);
    });
    afterEach(() => {
        process.kill();
    });
    test("abc", async () => {
        expect.assertions(1);
        process.write("abc\x13\x03"); // abc, Ctrl+S, Ctrl+C
        await sleep(400);
        expect(result()).toEqual("abc");
    });
    test("def with left-right", async () => {
        expect.assertions(1);
        process.write("df\x1B[De\x13\x03"); // df, left, e, Ctrl+S, Ctrl+C
        await sleep(400);
        expect(result()).toEqual("def");
    });
    test("newlines and vertical", async () => {
        expect.assertions(1);
        process.write("\rgh\x1B[Ai\x13\x03"); // Enter, ab, up, a, Ctrl+S, Ctrl+C
        await sleep(400);
        expect(result()).toEqual("i\ngh");
    });
    test("backspace", async () => {
        expect.assertions(1);
        process.write("qwerti\by\x13\x03"); // qwerti, backspace, y Ctrl+S, Ctrl+C
        await sleep(400);
        expect(result()).toEqual("qwerty");
    });
});
