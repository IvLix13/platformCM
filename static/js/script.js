const sideMenu = document.querySelector('.side-menu');
const toggleButton = document.querySelector('.side-menu-toggle');

document.addEventListener('DOMContentLoaded', async () => {
    
    showLoadingScreen();
    const loading = document.getElementById('loading');
    const content = document.getElementById('content');
    const cur_token = localStorage.getItem('user-token-CM'); // Получаем токен из localStorage
    let task_users = [
        {id: 23,title: "Title",desc:'some desc',deadline:Date("12/12/2025")},
        {id: 1,title: "Title1",desc:'some desc1',deadline:Date("13/12/2025")},
        {id: 4,title: "Title2",desc:'some desc2',deadline:Date("14/12/2025")},
        {id: 5,title: "Title3",desc:'some desc3',deadline:Date("15/12/2025")},
    ]
    localStorage.setItem("taskUser", JSON.stringify(task_users));
    console.log('first page ' + cur_token);
    if (!cur_token) {
        // Если токена нет, перенаправляем на страницу авторизации
        console.log('no token' + cur_token);
        window.location.href = '/auth/login/';
        return;
    }
    const sendData = {token: cur_token};
    const query = new URLSearchParams(sendData).toString();

        // Отправляем запрос на сервер для проверки токена
        fetch(`/auth/verify-token-lk/?${query}`, {
            method: 'GET',
            headers: {
                //'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'  },
        })
        .then(response => {
            if (response.status == 403)
                {
                    console.log(response);
                    console.log("error verify token");
                    //window.location.href = '/auth/login/';
                } 
            return response.json();
        })
        .then(data => {
            localStorage.setItem('user-role', data.data.role);
            console.log('success');
        });
        hideLoadingScreen();
    /*try {
        // Отправляем запрос на сервер для проверки токена
        const response = await fetch('/auth/verify-token-lk/', {
            method: 'GET',
            headers: {
                //'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json(); // Парсим ответ сервера
            if (data.role === 'other-user') {
                window.location.href = data.redirect
                localStorage.setItem('user-token', data.refresh);
                localStorage.setItem('user-role', data.role);
                
            } else {
                window.location.href = data.redirect
                localStorage.setItem('user-token', data.refresh);
                localStorage.setItem('user-role', data.role);
                loading.style.display = 'none';
                content.style.display = 'block';
                localStorage.setItem('activeService', null);
                ;
            }
        } else {
            // Токен истёк или невалиден — редирект на авторизацию
            window.location.href = '/auth/login/';
        }
    } catch (error) {
        console.error('Ошибка проверки токена:', error);
        window.location.href = '/auth/login/';
    }
    */

    // при переходе на / будет открыт экран загрузки, во время которого будет происходить проверка токена и выдача роли, и только после проверки роли идёт редирект на ту или иную страницу
    //загрузка таблицы и тасков в кэш
    //getTasksAndTable(); //тут юзаем асинхроночку
    //showLoadingScreen();
    //console.log('activeService: '+activeService);
    firtsLoading();
    const activeService = localStorage.getItem('activeService');
    if (activeService === 'table') {
        const tableData = localStorage.getItem('tableUser');
        console.log('Table data: '+tableData)
        if (tableData){
            renderTable();
        } else {
            fetchTabelData();
        }
    } else if (activeService === 'tasks') {
        const taskData = localStorage.getItem('taskUser');
        console.log('Task data: '+taskData) 
        if (taskData){
            console.log("get tasks");
        } else {
            console.log("fetch task request");
        }
    } else {
        // Если ничего не выбрано, показываем дефолтное сообщение
        firtsLoading();
    }
    //hideLoadingScreen();
});

async function refreshAccessToken(){
    const refreshToken = localStorage.getItem("refresh-token");
    
}

function firtsLoading(){
    console.log('Here forstLoading');
    const tableData = localStorage.getItem('tableUser');
    //fetchTabelData();
    fetchPersonalinfo();
    getPhrase();
    getPhoto();
        
    /*
    const taskData = localStorage.getItem('taskUser');
    if (taskData){
         renderTasks();
    } else {
        fetchTaskData();
    }
        */
}

function fetchPersonalinfo() {
    const sendData = {token:localStorage.getItem('user-token-CM')};
    console.log(localStorage.getItem('user-token-CM'));
    const query = new URLSearchParams(sendData).toString();
    fetch(`/api/get_perinfo/?${query}`, {
        method: 'GET',
        headers: {
            //'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'  },
    })
    .then(response => {
        if (response.status == 401)
            {
                console.log(response);
                console.log("error verify token");
                //window.location.href = '/auth/login/';
            } 
        return response.json();
    })
    .then(data => {
        console.log(data.data);
        localStorage.setItem('user-data-CM', data.data);
        const name_user = document.getElementById("name-user");
        name_user.textContent = data.data.i;
        const secondname_user = document.getElementById("secondname-user");
        secondname_user.textContent = data.data.f;
        const thirdname_user = document.getElementById("thirdname-user");
        thirdname_user.textContent = data.data.o;
        const rank_user = document.getElementById("rank-user");
        rank_user.textContent = data.data.rank;

        
        
    });
}

function getPhrase(){
    const sendData = {token:localStorage.getItem('user-token-CM')};
    console.log(localStorage.getItem('user-token-CM'));
    const query = new URLSearchParams(sendData).toString();
    fetch(`/api/get_phrase/?${query}`, {
        method: 'GET',
        headers: {
            //'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'  },
    })
    .then(response => {
        if (response.status == 401)
            {
                console.log(response);
                console.log("error verify token");
                //window.location.href = '/auth/login/';
            } 
        return response.json();
    })
    .then(data => {
        console.log(data.data.phrase);
        const phrase = document.getElementById("phrase-user");
        phrase.textContent = data.data.phrase;
    });
}

/*
function uploadPhoto(){
    const photo_upload = document.getElementById('new-photo');
    const formData = new FormData();
    formData.append('profile_pic', photo_upload.files[0]);
    formData.append('token', localStorage.getItem('user-token-CM'));

    fetch('/api/upload_photo/', {
        method: 'POST',
        body: formData
    })
    .then(response=> response.json())
    .then(data => console.log('Photo uploaded', data))
    .catch(error => console.error('Error while photo uploading', error));
}
*/
function getPhoto(){
    const sendData = {token:localStorage.getItem('user-token-CM')};
    console.log(localStorage.getItem('user-token-CM'));
    const query = new URLSearchParams(sendData).toString();
    fetch(`/api/get_photo/?${query}`, {
        method: 'GET',
        headers: {
            //'Authorization': `Bearer ${token}`,
             },
    })
    .then(response => {
        if (response.status == 401)
            {
                console.log(response);
                console.log("error verify token");
                //window.location.href = '/auth/login/';
            } 
        return response.blob();
    })
    .then(image => {
        const ig = URL.createObjectURL(image);
        document.getElementById('photo-cm').src = ig;
        //console.log(data.data.);
        //localStorage.setItem('phrase-data-CM', data.data.phrase);
        
    });
}
 async function fetchTabelData()
{
    try {
        console.log(localStorage.getItem('user-token-CM'));
        const user = localStorage.getItem('user-token-CM');
        const params = {token: user};
        const queryString = new URLSearchParams(params).toString();
	    const response = await fetch(`api/get_table/?${queryString}`, 
            {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            //body: JSON.stringify({ username: user })
        });
        
             const dataTable = await response.json();
            //console.log(dataTable);
            localStorage.setItem('tableUser', JSON.stringify(dataTable));
            renderTable();
   
} catch (error){
    console.error('Ошибка при загрузке данных сервиса table:', error);
}

}

async function fetchTaskData()
{
    renderTasks();
    console.log(localStorage.getItem('user-token-CM'));    
    const user = localStorage.getItem('user-token-CM');

        const params = {username: user};
        const queryString = new URLSearchParams(params).toString();
	    const responseTask = await fetch(`api/get_task/?${queryString}`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                //body: JSON.stringify({ username: user })
            });
        const dataTask = await responseTask.json();
        localStorage.setItem('tableUser', JSON.stringify(dataTask));
	    console.log("data from table:" + responseTask);
        renderTasks();
   

}
/*
async function getTasksAndTable()
{
    try {
        showLoadingScreen();
        //
        //const responeTasks = await fetch('api/get_task'); 
        //if (!responeTasks.ok){
        //    throw new Error(`Error: ${responeTasks.status}`);
        //}
        //console.log("тут должны быть данные по таскам");
        //const taskData = await responeTasks.json();
        //console.log("data from tasks:" +taskData );
        //localStorage.setItem('tasksUser', taskData);
        getTableData();
	getTaskData();
        const responeTable = await fetch('api/get_table');
    }
    catch(error)
    {
        console.error(error);
    }
    finally{
        hideLoadingScreen();
    }
}
*/

document.getElementById('table-btn').addEventListener('click', async () => {
    localStorage.setItem('activeService', 'table'); // Сохраняем состояние
    renderTable();
});

document.getElementById('tasks-btn').addEventListener('click', async () => {
    localStorage.setItem('activeService', 'tasks'); // Сохраняем состояние
    renderTasks();
});

function renderTable() {
    //тут загрузочный экран
    const tableData = JSON.parse(localStorage.getItem('tableUser'));
    console.log("data from table:" + JSON.stringify(tableData)); 
    // Получаем контейнер, куда будем вставлять таблицу
    const dynamicContent = document.getElementById('dynamic-content');
    dynamicContent,innerHTML = '';
    if (tableData && Array.isArray(tableData)) {
        // Создаем таблицу
        const table = document.createElement('table');
        table.classList.add('table','table-striped', 'table-hover');
        
        // Добавляем заголовки таблицы
        const thead = document.createElement('thead');
        thead.classList.add('table-light');
        thead.innerHTML = `
            <tr>
                <th>Текст ошибки</th>
                 <th>Путь к презентации</th>
                 <th>Номер слайда с ошибкой</th>
                <th>Имя объекта в презентации</th>
                <th>Дата ошибки</th>
                <th>Имя загружаемого файла</th>
            </tr>
        `;
        table.appendChild(thead);

        // Создаем тело таблицы
        const tbody = document.createElement('tbody');
        
        tableData.forEach(data => {
            const row = document.createElement('tr');
            //data.ppt_path = data.ppt_path.slice(2);
            row.innerHTML = `
                <td>${data.error_text}</td>
                <td>${data.ppt_path}</td>
                <td>${data.slide_index}</td>
                <td>${data.shape_name}</td>
                <td>${data.error_date_time}</td>
                <td>${data.filename}</td>
            `;
            // <td><button class="btn btn-primary" onclick="openFile('${data.ppt_path}')">Открыть</button></td>
            tbody.appendChild(row);
        });

        // Добавляем тело таблицы в таблицу
        table.appendChild(tbody);
        const table_cont = document.getElementById('table-container');
        table_cont.appendChild(table);
        // Вставляем таблицу в контейнер
        dynamicContent.appendChild(table_cont);
    }
    //убираем загрузочный экран
}

function openFile(path) {
    window.open(path, '_blank');
}


function exit(){
    localStorage.setItem('user-token-CM', null);
    window.location.href = '/auth/login';
}
/*
function renderTasks() {
    const dynamicContent = document.getElementById('dynamic-content');
    let tasksHTML = `
     <div class="container">
        <h2 class="mb-3">Менеджер задач</h2>
        <button id="toggleTasks" class="btn btn-info mb-3">Показать задачи</button>
        <div id="dynamic-element-task">
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
dynamicContent.innerHTML = tasksHTML;
    //generateNewTask();
    //generateTask();

}
*/
// Показываем/скрываем меню при нажатии на кнопку
toggleButton.addEventListener('click', (event) => {
    sideMenu.classList.toggle('show-menu');
    event.stopPropagation(); // Предотвращаем всплытие события
});

// Закрываем меню при клике вне его
document.addEventListener('click', (event) => {
    if (!sideMenu.contains(event.target) && !toggleButton.contains(event.target)) {
        sideMenu.classList.remove('show-menu');
    }
});

//загрузка фото
// Показываем модальное окно при нажатии на кнопку редактирования
document.getElementById('edit-photo-btn').addEventListener('click', () => {
    const uploadPhotoModal = new bootstrap.Modal(document.getElementById('uploadPhotoModal'));
    uploadPhotoModal.show();
});

// Обработка формы загрузки
document.getElementById('upload-photo-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const photo_upload = document.getElementById('new-photo');
    if (!photo_upload.files.length) return alert('Выберите файл для загрузки');

    const formData = new FormData();
    formData.append('profile_pic', photo_upload.files[0]);

    try {
        
       
        formData.append('token', localStorage.getItem('user-token-CM'));
    
       const response = await fetch('/api/upload_photo/', {
            method: 'POST',
            body: formData
        })
        

        if (!response.ok) throw new Error('Ошибка загрузки фото');
        const result = await response.json();

        // Обновляем фото пользователя
        document.getElementById('photo-cm').src = result.photoUrl;

        // Закрываем модальное окно
        const uploadPhotoModal = bootstrap.Modal.getInstance(document.getElementById('uploadPhotoModal'));
        uploadPhotoModal.hide();

        alert('Фото успешно обновлено!');
    } catch (error) {
        alert(`Ошибка: ${error.message}`);
    }
});
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
    console.log("in load tasks");
    $('#taskContainer').html(savedTasks);
};

    
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
*/
/*
function formatDateTime(dateString) {
            let date = new Date(dateString);
            let day = String(date.getDate()).padStart(2, '0');
            let month = String(date.getMonth() + 1).padStart(2, '0');
            let year = date.getFullYear();
            let hours = String(date.getHours()).padStart(2, '0');
            let minutes = String(date.getMinutes()).padStart(2, '0');
            return `${day}/${month}/${year} ${hours}:${minutes}`;
        }
/*
        function loadTasks() {
            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            let taskContainer = $('#taskContainer');
            taskContainer.empty();
            tasks.forEach(task => {
                let taskElement = $(
                    `<div class="task border" data-deadline="${task.deadline}" data-recurring="${task.recurring}" data-period="${task.period}">
                        <div class="task-header">
                            <strong>${task.title}</strong>
                            <img src="https://via.placeholder.com/40" class="avatar" title="${task.assignee}">
                        </div>
                        <p>${task.desc}</p>
                        <small>Дедлайн: ${formatDateTime(task.deadline)}</small>
                        <div class="countdown"></div>
                        <button class="btn btn-success btn-sm mt-2 completeTask">Выполнено</button>
                        <button class="btn btn-danger btn-sm mt-2 deleteTask">Удалить</button>
                    </div>`
                );
                taskContainer.append(taskElement);
            });
        }

function generateTask () {
          loadTasks();}

            $('#addTask').click(function() {
                let title = $('#taskTitle').val();
                let desc = $('#taskDesc').val();
                let deadline = $('#taskDeadline').val();
                let assignee = $('#taskAssignee').val();
                let recurring = $('#taskRecurring').is(":checked");
                let period = $('#recurringPeriod').val();

                if (title && desc && deadline && assignee) {
                    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    let newTask = { title, desc, deadline, assignee, recurring, period };
                    tasks.push(newTask);
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                    loadTasks();
                }
            });

            $(document).on('click', '.deleteTask', function() {
                let index = $(this).parent().index();
                let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
                tasks.splice(index, 1);
                localStorage.setItem('tasks', JSON.stringify(tasks));
                loadTasks();
            });

            $(document).on('click', '.completeTask', function() {
                let index = $(this).parent().index();
                let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
                if (tasks[index].recurring) {
                    let newDeadline = new Date(tasks[index].deadline);
                    newDeadline.setDate(newDeadline.getDate() + parseInt(tasks[index].period));
                    tasks[index].deadline = newDeadline.toISOString();
                } else {
                    tasks.splice(index, 1);
                }
                localStorage.setItem('tasks', JSON.stringify(tasks));
                loadTasks();
            });

            $('#toggleTasks').click(function() {
                $('#dynamic-element').toggle();
            });*/
/*
                const taskContainer = document.getElementById("dynamic-element");
                const addTaskButton = document.getElementById("add-task-btn");
                const modal = document.getElementById("task-modal");
                const closeModal = document.getElementById("close-modal");
                const saveTaskButton = document.getElementById("save-task");
                const taskList = document.getElementById("task-list");
           
                function loadTasks() {
                    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
                    taskList.innerHTML = "";
                    tasks.forEach(task => {
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
                    taskList.appendChild(taskElement);
                }
            
                function saveTask() {
                    const title = document.getElementById("task-title").value;
                    const description = document.getElementById("task-desc").value;
                    const deadline = document.getElementById("task-deadline").value;
                    const assignee = document.getElementById("task-assignee").value;
                    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
                    const newTask = { id: Date.now(), title, description, deadline, assignee };
                    tasks.push(newTask);
                    localStorage.setItem("tasks", JSON.stringify(tasks));
                    addTaskToDOM(newTask);
                    modal.style.display = "none";
                }
            
                function deleteTask(id) {
                    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
                    tasks = tasks.filter(task => task.id !== id);
                    localStorage.setItem("tasks", JSON.stringify(tasks));
                    loadTasks();
                }
            
                addTaskButton.addEventListener("click", function () {
                    modal.style.display = "block";
                });
            
                closeModal.addEventListener("click", function () {
                    modal.style.display = "none";
                });
            
                saveTaskButton.addEventListener("click", saveTask);
                loadTasks();*/