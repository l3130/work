document.getElementById('taskForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let title = document.getElementById('taskTitle').value;
    let desc = document.getElementById('taskDesc').value;
    addTask(title, desc);
    this.reset();
});

function addTask(title, desc) {
    let task = document.createElement('div');
    task.classList.add('task');
    task.innerHTML = `<strong>${title}</strong><p>${desc}</p>`;
    task.draggable = true;
    task.addEventListener('dragstart', dragStart);
    document.getElementById('notStarted').appendChild(task);
}

function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.outerHTML);
    event.target.remove();
}

document.querySelectorAll('.column').forEach(column => {
    column.addEventListener('dragover', function(event) {
        event.preventDefault();
    });
    column.addEventListener('drop', function(event) {
        event.preventDefault();
        let data = event.dataTransfer.getData('text/plain');
        column.innerHTML += data;
        column.querySelectorAll('.task').forEach(task => {
            task.addEventListener('dragstart', dragStart);
        });
    });
});


