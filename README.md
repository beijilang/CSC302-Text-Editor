# CSC302-Text-Editor

Meeting notes and the development plan are in [`docs/`](https://github.com/beijilang/CSC302-Text-Editor/tree/main/docs)

## Intro

There are powerful text editors such as Vim and Nano, we often still find it hard to modify text files because key shortcuts are different. To make it easier for users, we also made this text editor and made it into a npm library, so anyone could include this into their projects with ease.



## Initial set up

Install the [Node.js LTS](https://nodejs.org/en/download/) (14 as of writing) for your operating system.

## Installing dependencies

```bash
npm install
```

## Starting the editor

```bash
npm start
```

## Running tests

```bash
npm test
```

## Keymap

| KEY         | ACTION                |
| ----------- | --------------------- |
| Ctrl+S      | Save                  |
| Ctrl+A      | Save as               |
| Ctrl+Z      | Undo                  |
| Ctrl+Y      | Redo                  |
| Ctrl+C      | Terminate             |
| Ctrl+Q      | Show shortcut mapping |
| Ctrl+T      | Open command prompt   |
| Ctrl+F      | Find                  |
| Ctrl+G      | Activate recording    |
| SHIFT_LEFT  | Hightlight left       |
| SHIFT_RIGHT | Hightlight right      |
| F2          | Copy                  |

### Supported command in command prompt

- open (filename)
- save (optional: filename)
- update_shortcut (func)
- reset_shortcuts
- repeat (num)
  - Enter the text that you want to repeat then press Ctrl + C

### Features

- Matching parentheses

  - When moving the cursor on top of an open/close parentheses, the other matching one will be highlighted and underlined. 

- Copy and Paste 

  - Users can hold shift and use the cursor to select a range of text, after that, the user can press F2 to copy it, and then they can use CTRL+V to paste it into the terminal.

- Find

  - Users can press CTRL+F to activate the search and type in the key word.

- Command prompt

  - User can enter command mode by press CTRL+T

- Open and Save 

  - User can open a file by entering "open {filename}" in command mode
  - User can save an existing file by pressing CTRL + S or entering "save" in command mode
  - User can save a new file by pressing CTRL + A or entering "save {file_name}" in command mode

- Recording (Tony)

- Update shortcut

  - Users can enter "update_shortcut {any_shortcut}" in command mode to update a shortcut
  - For example, Users enter “update_shortcut UNDO”, then UNDO would be updated to the next non-character key you pressed

- Repeating

  - The repeating functionality can be used when you want to repeat a set of input many times.
  - User can enter "repeat {n}" in command mode and enter a set of input, the set of input would be repeat n times

  

  

