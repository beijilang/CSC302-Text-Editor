import termKit from 'terminal-kit';
var term = termKit.terminal ;

import TextEditor from "./index.js";

const editor = new TextEditor();
editor.init("CSC302.txt");
