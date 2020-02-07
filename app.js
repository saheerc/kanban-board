let board = JSON.parse(localStorage.getItem('kanflow-board')) || {
  todo: [
    { id: 1, title: 'Design wireframes', desc: 'Create initial wireframes for the landing page', priority: 'high', due: '2020-02-15' },
    { id: 2, title: 'Set up project repo', desc: '', priority: 'medium', due: '' },
  ],
  inprogress: [
    { id: 3, title: 'Build navigation component', desc: 'Responsive nav with mobile hamburger menu', priority: 'high', due: '2020-02-10' },
  ],
  review: [
    { id: 4, title: 'Write unit tests', desc: '', priority: 'medium', due: '' },
  ],
  done: [
    { id: 5, title: 'Project planning', desc: 'Define scope and milestones', priority: 'low', due: '' },
  ]
};

let draggedId = null;
let draggedFrom = null;
let currentCol = null;
let editingId = null;

function save() { localStorage.setItem('kanflow-board', JSON.stringify(board)); }

function render() {
  ['todo', 'inprogress', 'review', 'done'].forEach(col => {
    const list = document.getElementById(`list-${col}`);
    const count = document.getElementById(`count-${col}`);
    count.textContent = board[col].length;
    list.innerHTML = board[col].map(task => `
      <div class="task-card" draggable="true"
        ondragstart="onDragStart(event, ${task.id}, '${col}')"
        ondragend="onDragEnd(event)">
        <div class="task-top">
          <span class="task-title">${task.title}</span>
          <button class="task-delete" onclick="deleteTask('${col}', ${task.id})">✕</button>
        </div>
        ${task.desc ? `<p class="task-desc">${task.desc}</p>` : ''}
        <div class="task-footer">
          <span class="priority-badge priority-${task.priority}">${task.priority}</span>
          ${task.due ? `<span class="due-date">📅 ${task.due}</span>` : ''}
        </div>
      </div>
    `).join('');
  });
}

function addTask(col) {
  currentCol = col;
  editingId = null;
  document.getElementById('modal-title').textContent = 'Add Task';
  document.getElementById('modal-task-title').value = '';
  document.getElementById('modal-task-desc').value = '';
  document.getElementById('modal-priority').value = 'medium';
  document.getElementById('modal-due').value = '';
  document.getElementById('modal-overlay').classList.remove('hidden');
  document.getElementById('task-modal').classList.remove('hidden');
  setTimeout(() => document.getElementById('modal-task-title').focus(), 50);
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  document.getElementById('task-modal').classList.add('hidden');
}

function saveTask() {
  const title = document.getElementById('modal-task-title').value.trim();
  if (!title) return;
  const task = {
    id: Date.now(),
    title,
    desc: document.getElementById('modal-task-desc').value.trim(),
    priority: document.getElementById('modal-priority').value,
    due: document.getElementById('modal-due').value
  };
  board[currentCol].push(task);
  save();
  render();
  closeModal();
}

function deleteTask(col, id) {
  board[col] = board[col].filter(t => t.id !== id);
  save();
  render();
}

function addColumn() {
  const name = prompt('Column name:');
  if (!name) return;
  const key = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
  board[key] = [];
  const col = document.createElement('div');
  col.className = 'column';
  col.dataset.col = key;
  col.innerHTML = `
    <div class="col-header">
      <div class="col-title-wrap">
        <span class="col-dot dot-blue"></span>
        <h2 class="col-title" contenteditable="true">${name}</h2>
        <span class="task-count" id="count-${key}">0</span>
      </div>
      <button class="btn-add-task" onclick="addTask('${key}')">+</button>
    </div>
    <div class="task-list" id="list-${key}"
      ondragover="onDragOver(event)"
      ondrop="onDrop(event, '${key}')"></div>
  `;
  document.getElementById('board').appendChild(col);
  save();
}

function onDragStart(e, id, col) {
  draggedId = id;
  draggedFrom = col;
  e.target.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}

function onDragEnd(e) {
  e.target.classList.remove('dragging');
  document.querySelectorAll('.task-list').forEach(l => l.classList.remove('drag-over'));
}

function onDragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('drag-over');
}

function onDrop(e, col) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  if (!draggedId || draggedFrom === col) return;
  const task = board[draggedFrom].find(t => t.id === draggedId);
  if (!task) return;
  board[draggedFrom] = board[draggedFrom].filter(t => t.id !== draggedId);
  if (!board[col]) board[col] = [];
  board[col].push(task);
  save();
  render();
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

render();
