# KanFlow – Kanban Board

A drag-and-drop Kanban board for managing tasks across workflow stages. Built entirely with vanilla JavaScript — no frameworks, no libraries.

## Features

- Drag and drop tasks between columns
- Add, edit, and delete tasks
- Task modal with title, description, priority level, and due date
- Priority badges — Low, Medium, High
- Live task count per column
- Add custom columns dynamically
- Editable column titles (click to edit)
- Data persists via localStorage
- Keyboard support — Escape to close modal

## Tech Stack

- HTML5 (Drag and Drop API)
- CSS3 (Grid, Flexbox, animations)
- Vanilla JavaScript (localStorage, DOM, Drag & Drop API)

## Getting Started

```bash
git clone https://github.com/saheerc/kanban-board.git
cd kanban-board
open index.html
```

## How Drag & Drop Works

Uses the native HTML5 Drag and Drop API. On `dragstart`, the task ID and source column are stored. On `drop`, the task is moved from the source column array to the target column array, saved to localStorage, and re-rendered.

## Screenshots

![KanFlow Board](https://picsum.photos/seed/kanban-board-ss/800/450)

## Project Structure

```
kanban-board/
├── index.html
├── style.css
└── app.js
```

---

Built with HTML, CSS & JavaScript
