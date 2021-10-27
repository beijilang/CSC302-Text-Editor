# CSC302-Text-Editor

Meeting notes and the development plan are in [`docs/`](https://github.com/beijilang/CSC302-Text-Editor/tree/main/docs)

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

| KEY    | ACTION                |
| ------ | --------------------- |
| Ctrl+S | Save                  |
| Ctrl+A | Save as               |
| Ctrl+Z | Undo                  |
| Ctrl+Y | Redo                  |
| Ctrl+C | Terminate             |
| Ctrl+Q | Show shortcut mapping |
| Ctrl+T | Open command prompt   |

### Supported command in command prompt

- open (filename)
- save (optional: filename)
- change_shortcut (key, func)
- update_shortcut (func)
- reset_shortcuts
