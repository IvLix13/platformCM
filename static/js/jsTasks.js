
    // Отображаем задачи на странице
    function insertTasks(tasks) {
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
