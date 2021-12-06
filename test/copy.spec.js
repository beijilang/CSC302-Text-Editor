import fs from "fs";
import clipboard from "clipboardy";
import pty from "node-pty";

const sleep = interval => new Promise(resolve => setTimeout(resolve, interval));

// Could also use already installed dependent package ansi-escapes
const LEFT = "\x1B[D";
const RIGHT = "\x1B[C";
const SHIFT_LEFT = "\x1B[1;2D";
const SHIFT_RIGHT = "\x1B[1;2C";
const F2 = "\x1BOQ";

describe("Highlight and copy to clipboard (pseudo-TTY child process)", () => {
    beforeAll(() => {
        fs.writeFileSync("copy.txt", "U of T CSC302");
    });
    let process;
    beforeEach(async () => {
        process = pty.spawn("node", ["src", "copy.txt"]);
        await sleep(400);
    })
    afterEach(() => {
        process.kill();
    });
    test("example 1", async () => {
        try {
            clipboard.writeSync("");
        } catch(error) {
            console.warn("Skipping copy test", error);
            return;
        }
        expect.assertions(1);
        process.write(SHIFT_LEFT.repeat(13) + F2 + "\x03");
        await sleep(400);
        expect(clipboard.readSync()).toEqual("U of T CSC302");
    });
    test("example 2", async () => {
        try {
            clipboard.writeSync("");
        } catch(error) {
            console.warn("Skipping copy test", error);
            return;
        }
        expect.assertions(1);
        process.write(LEFT.repeat(6) + SHIFT_RIGHT.repeat(3) + F2 + "\x03");
        await sleep(400);
        expect(clipboard.readSync()).toEqual("CSC");
    });
    test("example 3", async () => {
        try {
            clipboard.writeSync("");
        } catch(error) {
            console.warn("Skipping copy test", error);
            return;
        }
        expect.assertions(1);
        process.write(LEFT.repeat(6) + SHIFT_RIGHT.repeat(3) + SHIFT_LEFT.repeat(4) + F2 + "\x03");
        await sleep(400);
        expect(clipboard.readSync()).toEqual(" CSC");
    });
});
