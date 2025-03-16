    /*
    // Отображаем задачи на странице
    function insertTasks(tasks) {

        const dynamic_content = $('dynamic-content');
        dynamic_content.innerHTML = '';
        const tableBody = $('#tasks-table tbody');
        tableBody.empty(); // Очищаем старые данные

        tasks.forEach((task, index) => {
            const rowClass = task.createdBy === 'self' ? 'task-owner' : 'task-boss';
            const timeLeft = new Date(task.deadline) - Date.now();

            // Запускаем таймер для уведомлений за 1 час до завершения
            if (timeLeft > 0) {
                setTimeout(() => {
                    alert(`Задача "${task.description}" скоро должна быть завершена!`);
                }, timeLeft - 3600000); // За 1 час до дедлайна
            }

            tableBody.append(`
                <tr class="${rowClass}" data-id="${task.id}">
                    <td>${index + 1}</td>
                    <td>${task.description}</td>
                    <td>${task.createdBy === 'self' ? 'Вы' : 'Начальник'}</td>
                    <td class="priority">${task.priority}</td>
                    <td>
                        <button class="btn btn-sm btn-success increase-priority" data-id="${task.id}">+</button>
                        <button class="btn btn-sm btn-danger decrease-priority" data-id="${task.id}">-</button>
                    </td>
                </tr>
            `);
        });
    }

    // Изменение приоритета задачи (асинхронно)
    $(document).on('click', '.increase-priority, .decrease-priority', function () {
        const taskId = $(this).data('id');
        const action = $(this).hasClass('increase-priority') ? 'increase' : 'decrease';

        fetch(`/tasks/${taskId}/priority`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при обновлении приоритета');
            }
            return response.json();
        })
        .then(updatedTask => {
            updateTaskRow(updatedTask);
        })
        .catch(error => {
            alert(error.message);
        });
    });

    // Обновление строки задачи в таблице
    function updateTaskRow(task) {
        const row = $(`#tasks-table tbody tr[data-id="${task.id}"]`);
        row.find('.priority').text(task.priority);
        // Можно обновить другие данные в строке, если нужно
    }

    // Окно создания новой задачи
    $('#taskForm').on('submit', function (e) {
        e.preventDefault();

        const description = $('#taskDescription').val();
        const priority = $('#taskPriority').val();
        const assignee = $('#taskAssignee').val(); // Для подчиненного

        const taskData = { description, priority, assignee };

        // Асинхронный запрос на сервер для создания задачи
        fetch('/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        })
        .then(response => response.json())
        .then(newTask => {
            addTaskToTable(newTask);
            $('#taskModal').modal('hide'); // Закрываем модальное окно
        })
        .catch(error => {
            alert('Ошибка при создании задачи: ' + error.message);
        });
    });

    // Добавляем задачу в таблицу (без перезагрузки)
    function addTaskToTable(task) {
        const rowClass = task.createdBy === 'self' ? 'task-owner' : 'task-boss';
        $('#tasks-table tbody').append(`
            <tr class="${rowClass}" data-id="${task.id}">
                <td>${task.id}</td>
                <td>${task.description}</td>
                <td>${task.createdBy === 'self' ? 'Вы' : 'Начальник'}</td>
                <td class="priority">${task.priority}</td>
                <td>
                    <button class="btn btn-sm btn-success increase-priority" data-id="${task.id}">+</button>
                    <button class="btn btn-sm btn-danger decrease-priority" data-id="${task.id}">-</button>
                </td>
            </tr>
        `);
    }
function  generateNewTask()
{
        const description = $('#taskDescription').val();
        const priority = $('#taskPriority').val();
        const assignee = $('#taskAssignee').val(); // Для подчиненного

        const taskData = { description, priority, assignee };
        const rowClass = 'task-owner';
        $('#tasks-table tbody').append(`
            <tr class="${rowClass}" data-id="0">
                <td>9999</td>
                <td></td>
                <td></td>
                <td class="priority">99</td>
                <td>
                    <button class="btn btn-sm btn-success increase-priority" data-id="99">+</button>
                    <button class="btn btn-sm btn-danger decrease-priority" data-id="99">-</button>
                </td>
            </tr>
        `);

        // Асинхронный запрос на сервер для создания задачи
        /*
        fetch('/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        })
        .then(response => response.json())
        .then(newTask => {
            addTaskToTable(newTask);
            $('#taskModal').modal('hide'); // Закрываем модальное окно
        })
        .catch(error => {
            alert('Ошибка при создании задачи: ' + error.message);
        });
        
};*/
/*
function formatDateTime(dateString) {
    let date = new Date(dateString);
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let year = date.getFullYear();
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
};

function saveTasks() {
    localStorage.setItem('taskUser', $('#taskContainer').html());
    console.log("in tasks");
};

function loadTasks() {
    let savedTasks = localStorage.getItem('taskUser');
    $('#taskContainer').html(savedTasks);
    console.log("in load tasks");
};

$(document).ready(function() {
    loadTasks();
    
    $('#toggleTasks').click(function() {
        console.log('in function toggle');
        $('#dynamic-element-task').toggle();
    });
    
    $('#showTaskForm').click(function() {
        console.log('in function showTask');
        $('#taskForm').toggle();
    });
$('#taskRecurring').change(function() {
        $('#recurringPeriod').prop('disabled', !$(this).is(':checked'));
    });

    $('#addTask').click(function() {
        let title = $('#taskTitle').val();
        let desc = $('#taskDesc').val();
        let deadline = $('#taskDeadline').val();
        let assignee = $('#taskAssignee').val();
        let recurring = $('#taskRecurring').is(":checked");
        let period = $('#recurringPeriod').val();

        if (title && desc && deadline && assignee) {
            let deadlineFormatted = formatDateTime(deadline);
            let task = $(`
                <div class="task border" data-deadline="${deadline}" data-recurring="${recurring}" data-period="${period}">
                    <div class="task-header">
                        <strong>${title}</strong>
                        <img src="https://via.placeholder.com/40" class="avatar" title="${assignee}">
                    </div>
                    <p>${desc}</p>
                    <small>Дедлайн: ${deadlineFormatted}</small>
                    <div class="countdown"></div>
                    <button class="btn btn-success btn-sm mt-2 completeTask">Выполнено</button>
                    <button class="btn btn-danger btn-sm mt-2 deleteTask">Удалить</button>
                </div>`
            );
            $('#taskContainer').append(task);
            saveTasks();
            $('#taskTitle, #taskDesc, #taskDeadline, #taskAssignee').val('');
            $('#taskRecurring').prop("checked", false);
            $('#recurringPeriod').prop('disabled', true);
        }
    });

    $(document).on('click', '.deleteTask', function() {
        $(this).parent().remove();
        saveTasks();
    });

    $(document).on('click', '.completeTask', function() {
        let task = $(this).parent();
        if (task.data("recurring") === true) {
            let newDeadline = new Date(task.data("deadline"));
            newDeadline.setDate(newDeadline.getDate() + parseInt(task.data("period")));
            task.data("deadline", newDeadline.toISOString());
            task.find("small").text("Дедлайн: " + formatDateTime(newDeadline));
        } else {
            task.remove();
        }
        saveTasks();
    });
    
    $("#taskContainer").sortable({ handle: ".task" });
});*/

/*
const taskContainer = document.getElementById("dynamic-element");
const addTaskButton = document.getElementById("add-task-btn");
const modal = document.getElementById("task-modal");
const closeModal = document.getElementById("close-modal");
const saveTaskButton = document.getElementById("save-task");
const taskList = document.getElementById("task-list");
*/

function renderTasks() {
    document.getElementById("dynamic-content").innerHTML = '';
    let tasksHTML = `
     <div class="container">
        <h2 class="mb-3">Менеджер задач</h2>
        <button id="toggleTasks" class="btn btn-info mb-3">Показать задачи</button>
        <div id="dynamic-element-task" style="display: none;" >
            <button id="showTaskForm" class="btn btn-primary mb-3">Добавить задачу</button>
            <div id="taskForm" class="mb-3" style="display: none;">
                <input type="text" id="taskTitle" class="form-control" placeholder="Заголовок">
                <textarea id="taskDesc" class="form-control mt-2" placeholder="Описание"></textarea>
                <input type="datetime-local" id="taskDeadline" class="form-control mt-2">
                <select id="taskAssignee" class="form-control mt-2">
                    <option value="">Выберите исполнителя</option>
                    <option value="Иван">Иван</option>
                    <option value="Мария">Мария</option>
                    <option value="Алексей">Алексей</option>
                </select>
                <div class="form-check mt-2">
                    <input type="checkbox" id="taskRecurring" class="form-check-input">
                    <label for="taskRecurring" class="form-check-label">Повторяющаяся задача</label>
                </div>
                <select id="recurringPeriod" class="form-control mt-2" disabled>
                    <option value="1">Каждый день</option>
                    <option value="7">Каждую неделю</option>
                    <option value="30">Каждый месяц</option>
                </select>
                <button id="addTask" class="btn btn-success mt-2">Добавить задачу</button>
            </div>
            <div id="taskContainer" class="p-3"></div>
        </div>
    </div>
`;
document.getElementById("dynamic-content").innerHTML = tasksHTML;
loadTasks();
}

/*function loadTasks() {
    document.getElementById("dynamic-element-task").style.display = 'none';
    const tasks = localStorage.getItem("taskUser") || [];
    console.log("Task User: " + tasks)
    document.getElementById("taskContainer").innerHTML = '';
    Object.values(tasks).forEach(task => {
        addTaskToDOM(task);
    });
     
}

function addTaskToDOM(task) {
    const taskElement = document.createElement("div");
    taskElement.className = "task";
    taskElement.innerHTML =` 
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <p>Дедлайн: ${task.deadline}</p>
        <p>Назначено: ${task.assignee}</p>
        <button class="delete-task">Удалить</button>`
    ;
    taskElement.querySelector(".delete-task").addEventListener("click", function () {
        deleteTask(task.id);
    });
    //document.getElementById("task-list").appendChild(taskElement);
}

function saveTask() {
    const title = document.getElementById("taskTitle").value;
    const description = document.getElementById("taskDesc").value;
    const deadline = document.getElementById("taskDeadline").value;
    const assignee = document.getElementById("taskAssigneee").value;
    const tasks = JSON.parse(localStorage.getItem("taskUser")) || [];
    const period = document.getElementById("taskRecurring").value;
    const newTask = { id: Date.now(), title, description, deadline, assignee, period };
    tasks.push(newTask);
    localStorage.setItem("taskUser", JSON.stringify(tasks));
    addTaskToDOM(newTask);
    document.getElementById("taskForm").style.display = "none";
}

function deleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem("taskUser")) || [];
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem("taskUser", JSON.stringify(tasks));
}

function formatDateTime(dateString) {
    let date = new Date(dateString);
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let year = date.getFullYear();
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}*/
/*
document.getElementById("addTask").addEventListener("click", function () {
    document.getElementById("taskForm").style.display = "block";
});

document.getElementById("close-modal").addEventListener("click", function () {
    document.getElementById("taskForm").style.display = "none";
});

document.getElementById("save-task").addEventListener("click", saveTask);

*/

function formatDateTime(dateString) {
    let date = new Date(dateString);
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let year = date.getFullYear();
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes;
}

function saveTasks() {
    localStorage.setItem('taskUser', document.getElementById('taskContainer').innerHTML);
}

function loadTasks() {
    let savedTasks = localStorage.getItem('taskUser');
    console.log("task user " + savedTasks);
    if (savedTasks) {
        document.getElementById('taskContainer').innerHTML = savedTasks;
    }
}
    document.getElementById('toggleTasks').addEventListener('click', function() {
        let dynamicElement = document.getElementById('dynamic-element-task');
        dynamicElement.style.display = dynamicElement.style.display === 'none' ? 'block' : 'none';
    });

    document.getElementById('showTaskForm').addEventListener('click', function() {
        let taskForm = document.getElementById('taskForm');
        taskForm.style.display = taskForm.style.display === 'none' ? 'block' : 'none';
    });

    document.getElementById('taskRecurring').addEventListener('change', function() {
        let recurringPeriod = document.getElementById('recurringPeriod');
        recurringPeriod.disabled = !this.checked;
    });

    document.getElementById('addTask').addEventListener('click', function() {
        let title = document.getElementById('taskTitle').value;
        let desc = document.getElementById('taskDesc').value;
        let deadline = document.getElementById('taskDeadline').value;
        let assignee = document.getElementById('taskAssignee').value;
        let recurring = document.getElementById('taskRecurring').checked;
        let period = document.getElementById('recurringPeriod').value;

        if (title && desc && deadline && assignee) {
            let deadlineFormatted = formatDateTime(deadline);
            let task = document.createElement('div');
            task.classList.add('task', 'border');
            task.setAttribute('data-deadline', deadline);
            task.setAttribute('data-recurring', recurring);
            task.setAttribute('data-period', period);

            task.innerHTML = 
                `<div class="task-header">
                    <strong>${title}</strong>
                    <img src="https://via.placeholder.com/40" class="avatar" title="${assignee}">
                </div>
                <p>${desc}</p>
                <small>Дедлайн: ${deadlineFormatted}</small>
                <div class="countdown"></div>
                <button class="btn btn-success btn-sm mt-2 completeTask">Выполнено</button>
                <button class="btn btn-danger btn-sm mt-2 deleteTask">Удалить</button>`
            ;
            document.getElementById('taskContainer').appendChild(task);
            saveTasks();
            document.getElementById('taskTitle').value = '';
            document.getElementById('taskDesc').value = '';
            document.getElementById('taskDeadline').value = '';
            document.getElementById('taskAssignee').value = '';
            document.getElementById('taskRecurring').checked = false;
            document.getElementById('recurringPeriod').disabled = true;
        }
    });

    document.getElementById('taskContainer').addEventListener('click', function(event) {
        if (event.target.classList.contains('deleteTask')) {
            event.target.parentElement.remove();
            saveTasks();
        }

        if (event.target.classList.contains('completeTask')) {
            let task = event.target.parentElement;
 if (task.dataset.recurring === 'true') {
                let newDeadline = new Date(task.dataset.deadline);
                newDeadline.setDate(newDeadline.getDate() + parseInt(task.dataset.period));
                task.dataset.deadline = newDeadline.toISOString();
                task.querySelector('small').textContent = 'Дедлайн: ' + formatDateTime(newDeadline);
            } else {
                task.remove();
            }
            saveTasks();
        }
    });

    
    /*
    // Make task container sortable (you might need a library like SortableJS for this)
    // Here is a basic example without any external library:
    
    
    let taskContainer = document.getElementById('taskContainer');
    let draggingTask = null;

    taskContainer.addEventListener('dragstart', function(event) {
        if (event.target.classList.contains('task')) {
            draggingTask = event.target;
        }
    });

    taskContainer.addEventListener('dragover', function(event) {
        event.preventDefault();
        let afterElement = getDragAfterElement(taskContainer, event.clientY);
        if (afterElement == null) {
            taskContainer.appendChild(draggingTask);
        } else {
            taskContainer.insertBefore(draggingTask, afterElement);
        }
    });

    taskContainer.addEventListener('dragend', function() {
        draggingTask = null;
    });
*/
    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.task:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }