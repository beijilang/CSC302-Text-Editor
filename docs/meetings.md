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

## Nov 4

- TA Meeting 
- A3 is out next Monday
- Final presentation is on Dec 6th, could be a group presentation in front of the class and then one on one with the prof
- Meaning we need to finished milestone 3 and 4 next month.
There are 3 new features we need to work on, and someone need to write the test script
- All team member agree to schedule a meeting after reading week to talk about task assignment and goals for the next milestone.

## Nov 15

- Group Meeting with all team members to go over plans for milestone 3.
- From the previous meeting with Greg, we decided to narrow down our list of advanced features to:
  - Record Keyboard Input and replicate (Lantao)
  - Repeat Input (Yujie)
  - Highlight the matching parentheses (Wenshuo)
  - General testing (Kevin)
- Yujie decided to work on repeat because it's a feature related to shortcut customization, which he worked on during the last milestone.
- Lantao decided to work on record becauses he proposed the undo/redo design pattern, and he had a lot of experience working on those. Undo/redo for record can be complicated, so he decided to work on record.
- Wenshuo worked with a similar problem related to finding the matching parentheses during his PEY, so he decided to work on that.
- Kevin had experience with testing javascript app, so he will do the testing part.
- Greg mentioned some default keyboard shortcut should not be overwritten by user.
- Progress checkup from each team member:
  - Yujie fixed some bugs related to shortcut
  - Lantao finalized find/replace from last milestone, and did some general testing on the app.

## Nov 18

- TA Meeting
- General checkup with the TA
- Updated our progress so far as well as our goal for milestone 3.

## Nov 21

- Group member meeting
- Had a in group discussion about the difference between record and repeat feature. Record act as a shortcut that allow user to repeat a set of action anytime they want. Repeat is a command that repeat input for multiple time.
- Progress checkup from each group member
  - Yujie finished repeat
  - Wenshuo was still working on his part
  - Lantao started to work on record, and found some bugs related to missing cursor.
- Lantao encountered an unexpected techinical difficulty when implementing replace. Inserting text into an existing text buffer at a given location is very difficult (terminal-kit's text buffer is not designed to handle case like this). After some discussion, we decide to give up on this feature, and use the time to make sure our application is bug free.

## Nov 25

- TA meeting
- Progress checkup from each group member
  - Lantao finished record, and fixed couple bugs
  - Yujie fixed the cursor bug mentioned in the last group meeting
  - No update from Wenshuo/Kevin
- Clarified some questions related to the final presentation and interview.
  - When is the final presentation/interview (Dec 6)
  - What the presentation/interview are about (just to make sure each team member contribute the the project)

## Nov 28

- Group member meeting
- Sync up all the development work before a3 is due.
  - Wenshuo finished parentheses highlight, but discovered several bugs related to the cursor, which Lantao and Yujie will fix in the next few days.
    - Cursor will not move to a new line when adding more text at the end of a line (fixed)
    - At the end/begining of a line, cursor should move down/up when pressing right/left (fixed)
  - Lantao and Yujie has been actively testing the application to make sure all features work as intended.
- Looked back at our milestone and went over which feature has been implemented, and which haven't
  - We completed most of the features listed in our milestone, which includes:
    - Render text
    - Cursor movement
    - Find
    - open/close file
    - save/save as
    - vim style command prompt
    - copy/paste
    - Record and Repeat keystroke
    - Repeat operation
    - Find matching parentheses
  - There are only a few basic features we haven't implement, which are:
    - replace (This feature is extremely difficult to implement due to the terminal-kit's text buffer design. After a in-team discussion, we decide to move on with other features)
    - Show line numbers (This will drasticallly change the logic for finding the parentheses due to the change in screen buffer)
  - In conclusion, we implemented most of the basic features we listed in our milestone. Most of the features we didn't implement are "add-on" features - our plan is to implement them after the main features are done. The only exception is replace, which we encounter unexpected difficulty when implementing it.
- Celebrate on our project's completion :)
