// import termKit from 'terminal-kit';
// var term = termKit.terminal;

import TextEditor from "../src/TextEditor.js";

const editor = new TextEditor();
editor.init();
// editor.set_shortcut('CTRL_Z','UNDO');
// editor.set_shortcut('CTRL_Y','REDO');

// import fs from 'fs';
// var data=fs.readFileSync('../src/customization_shortcut.json', 'utf8');
// var words=JSON.parse(data);
// var customized_shortcut = new Map();
// for (var i of words){
//     customized_shortcut.set(i['key'],i['func']);

// }
// console.log(customized_shortcut.get('a'))
// var e = 'a';
// if (e instanceof KeyboardEvent){
//     console.log("Q")
//   }
