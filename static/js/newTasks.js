async function fetchTasks() {
    $("#dynamic-content").html(`
        <div id="task-container">
            <h3 class="mt-3">Список тасков</h3>
            <button id="open-task-form" class="btn btn-primary mb-3">Создать таск</button>
            <div id="tasks-list" class="mt-3"></div>
        </div>
    `);

    let response = await fetch("/tasks");
    let tasks = await response.json();

    if (tasks.length === 0) {
        $("#tasks-list").html('<p class="text-muted">Нет активных тасков.</p>');
        return;
    }

    tasks.forEach(task => {
        let taskHTML = `
            <div class="task-card priority-${task.priority}" draggable="true" data-id="${task.id}">
                <div class="task-title">${task.title}</div>
                <div class="task-desc">${task.desc}</div>
                <div class="task-footer">
                    <button class="btn btn-danger close-task" data-id="${task.id}">Закрыть</button>
                </div>
            </div>
        `;
        $("#tasks-list").append(taskHTML);
    });

    attachDragAndDrop();
}


async function createTask(taskData) {
    let response = await fetch("/tasks/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData)
    });

    if (response.ok) {
        $("#taskModal").modal("hide").remove();
        fetchTasks();
    } else {
        alert("Ошибка при создании таска!");
    }
}

$(document).on("click", "#tasks-btn", fetchTasks);
$(document).on("click", "#open-task-form", function () {
    let modalHTML = `
        <div class="modal fade" id="taskModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Создать таск</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <input type="text" id="task-title" class="form-control mb-2" placeholder="Заголовок">
                        <textarea id="task-desc" class="form-control mb-2" placeholder="Описание"></textarea>
                        <input type="text" id="task-assignee" class="form-control mb-2" placeholder="Кому назначен">
                        <input type="datetime-local" id="task-deadline" class="form-control mb-2">
                        <select id="task-priority" class="form-control mb-2">
                            <option value="1">🔥 Высокий</option>
                            <option value="2">🔶 Средний</option>
                            <option value="3">🟡 Низкий</option>
                        </select>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                        <button id="submit-task" class="btn btn-primary">Создать</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    $("body").append(modalHTML);
    $("#taskModal").modal("show");
});

$(document).on("click", "#submit-task", function () {
    let taskData = {
        title: $("#task-title").val(),
        desc: $("#task-desc").val(),
        owner_task: $("#task-assignee").val(),
        deadline: $("#task-deadline").val(),
        priority: $("#task-priority").val()
    };

    createTask(taskData);
});

$(document).on("click", ".close-task", function () {
    let taskId = $(this).data("id");

    let modalHTML = `
        <div class="modal fade" id="closeTaskModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Закрытие таска</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <input type="file" id="proofFile" class="form-control mb-2">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="confirmCheckbox">
                            <label class="form-check-label">Доведено до начальства</label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                        <button class="btn btn-primary" id="confirmCloseTask" data-id="${taskId}">Закрыть</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    $("body").append(modalHTML);
    $("#closeTaskModal").modal("show");
});

$(document).on("click", "#confirmCloseTask", async function () {
    let taskId = $(this).data("id");
    let proof = $("#proofFile")[0].files[0];
    let confirmed = $("#confirmCheckbox").is(":checked");

    await fetch("/tasks/close", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, proof, confirmed })
    });

    $("#closeTaskModal").modal("hide").remove();
    fetchTasks();
});
