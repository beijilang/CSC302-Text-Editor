# CS Boys Meeting Notes

## Sept 23 - 24

- Discussed the preferred projects
  - Prioritized the javascript project because all of our members had one year exprienment with web during PEY and we want to try something different
-  Discussed our strength
  - Yujie has more testing experience during the PEY
  - Lantao has more terminal development experience during the PEY
  - Wenshuo has more OOP exprience during the PEY

## Sept 29

- Start work on Assignment 1
  - Took a look at the given repository
  - Discussed the required feature that we need to implement
  - Discussed the four milestones

## Sept 30

- Office Hour with TA
  - Clarified our confusion about the tech stack
  - Ensured we are fine with our workloads

## Oct 4

- Discussed project structure
  - The text editor is a npm library that can init by another js program, allowing them to add their own features on top of our text editor
  - Decided to go with the most simple approach, all methods would go into one file for now
- Discussed how to implement undo and redo because every action should be record by those features
  - Decided to use a linked list to store every action for now
    - Pro: easy to implement
    - Con: waste a lot of space and time
  - Still looking for a new approach

## Oct 6

- Re-designed on the undo and redo
  - Using Command Pattern to store every action
- Re-arranged milestones
  - We had to implement redo and undo feature for every other features, so it can't be an individual milestone

## Oct 7

- Meeting with the TA
  - Went over our A1 contribution
  - Discuss about our next step, we need to re-arrange our milestone
- Realized cursor position is a problem, sometimes it's not in the correct position

## Oct 14

- TA meeting
  - Kevin joins

## Oct 21

- TA meeting
  - Tony, Kevin present

## Oct 27

- All milestones done except copy and paste
- Waiting on copy and paste and we want to meet with Greg
- Merging in ESLint/Prettier PR
- Backspace is working, delete is not
  
## Oct 28

- TA meeting
  - General progress checkup

## Nov 1

- Meeting with greg, discuss progress so far and milestone 3
- Additional features to implement for milestone 3
  - Record and Repeat keystroke
  - Repeat operation
  - Find matching parentheses

