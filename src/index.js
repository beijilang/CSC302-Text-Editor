#!/usr/bin/env node

import TextEditor from "./TextEditor.js";

const editor = new TextEditor();
editor.init(process.argv[2]);
