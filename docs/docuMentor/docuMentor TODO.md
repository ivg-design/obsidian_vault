---
title: DocuMentor TODO
date: 2024-08-29
tags:
  - docuMentor
  - todo
  - refactoring
  - development
status:  in progress
---
1. it still says phase 1 of 1 there definitely more than one phase!  and it does not update at all throughout the process!
2. debug and raw modes are not implemented -  when i go to debug all i see is empty statements and raw mode doesn't show anything at all - it looks like you tried to move the raw messages to the debug but and left raw mode empty - what you must do is 1) add debugging messages to different modules that can help debug and diagnose issue, make those messages visible in debug mode, and raw   mode supposed to show unformatted json messages sent to claude 
3. files still shows 0/0 ?! 
4. the tool result messages are still unformatted received line n: messages are likewise             │unformatted  - for the messages you need to strip out the json formatting and leave only the human readable messages in tact - if they do not fit in one line, then the line must break! - these type of criptic messages are unneeded - ![[Pasted image 20250829083834.png]]
 5. add a spinner in the upper right corner of the status bar - it should indicated work in progress  │
 6. for the "free" message - i assume that this is the indication that the lock file is currently unlocked - make this clearer, and add another line between the shortcut message and the topmost line - this is where you should update the lockfile status - as it is updated by the script every 5s 
 7. there should be a counter of how many docs have already been written and the name of the current  one being worked on 
 8. instead of creating documentation, currently documentor is creating a stream of consciousness document in obsidian while it is creating the actual documentation files in the project folder - it must be creating hte documents in the obsidian docs folder following the hierarchical structure of folder per project and inside if there is one tool/project/utility/plugin/extension/script then just the documentation while if there are multiple, each one gets a subfolder and its own documentation, and the repo a general document and structure overview 
 9. it seems either it is is improperly documenting the project  [], or
│   the project is incorrect - it should not have any heuristic algorythms for determinining type of     │
│   project or the tag analysis - everything should be passed through documentor agent and only the      │
│   documentor agent is making any determinations! \                                                     │
│   10. it is generating documentsation without the frontmatter - the tags, dates, backlinks and front   │
│   links,  and all other required information - no file can be generated without it! \                  │
│   11. times stamps must be in local time! \ \                                                          │
│   12.           