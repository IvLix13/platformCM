const sideMenu = document.querySelector('.side-menu');
const toggleButton = document.querySelector('.side-menu-toggle');

document.addEventListener('DOMContentLoaded', async () => {
    
    showLoadingScreen();
    const loading = document.getElementById('loading');
    const content = document.getElementById('content');
    const cur_token = localStorage.getItem('user-token-CM'); // Получаем токен из localStorage
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
            renderTasks();
        } else {
            fetchTaskData();
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
        
    });
}

function insertPersonalInfo(data){

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
        localStorage.setItem('phrase-data-CM', data.data.phrase);
        
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
        const user = 'Likhobaba305';
	    const responseTable = await fetch('api/get_table');
        const dataTable = await responseTable.json();
        localStorage.setItem('tableUser', JSON.stringify(dataTable));
	    renderTable();
   
} catch (error){
    console.error('Ошибка при загрузке данных сервиса table:', error);
}

}

async function fetchTaskData()
{
    try {
	    const responseTask = await fetch('api/get_task');
        const dataTask = await responseTask.json();
        localStorage.setItem('tableUser', JSON.stringify(dataTask));
	    console.log("data from table:" + responseTask);
        renderTable();
   
} catch (error){
    console.error('Ошибка при загрузке данных сервиса task:', error);
}
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
    
    if (tableData && Array.isArray(tableData)) {
        // Создаем таблицу
        const table = document.createElement('table');
        table.classList.add('table', 'table-bordered');
        
        // Добавляем заголовки таблицы
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Текст ошибки</th>
                 <th>Путь к презентации</th>
                 <th>Номер слайда с ошибкой</th>
                <th>Имя объекта в презентации</th>
                <th>Дата ошибки</th>
                <th>Имя загружаемого файла</th>
                <th>дДействие с файлом</th>
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
                <td><button class="btn btn-primary" onclick="openFile('${data.ppt_path}')">Открыть</button></td>
            `;
            tbody.appendChild(row);
        });

        // Добавляем тело таблицы в таблицу
        table.appendChild(tbody);

        // Вставляем таблицу в контейнер
        dynamicContent.appendChild(table);
    }
    //убираем загрузочный экран
}

function openFile(path) {
    window.open(path, '_blank');
}


function renderTasks() {
    /*const dynamicContent = document.getElementById('dynamic-content');
    let tasksHTML = `
    <div class="container py-4">
<h1 class="mb-4">Task Management</h1>

<!-- Кнопки -->
<div class="d-flex justify-content-end mb-3">
    <button id="create-task-self" class="btn btn-primary me-2">Создать задачу для себя</button>
    <button id="create-task-subordinate" class="btn btn-secondary">Создать задачу для подчиненного</button>
</div>

<!-- Таблица задач -->
<table class="table table-striped" id="tasks-table">
    <thead>
        <tr>
            <th>#</th>
            <th>Описание</th>
            <th>Создатель</th>
            <th>Приоритет</th>
            <th>Действия</th>
        </tr>
    </thead>
    <tbody>
        <!-- Динамическое наполнение -->
    </tbody>
</table>
</div>

<!-- Модальное окно -->
<div class="modal fade" id="taskModal" tabindex="-1" aria-labelledby="taskModalLabel" aria-hidden="true">
<div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="taskModalLabel">Создать задачу</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form id="taskForm">
                <div class="mb-3">
                    <label for="taskDescription" class="form-label">Описание</label>
                    <input type="text" class="form-control" id="taskDescription" required>
                </div>
                <div class="mb-3">
                    <label for="taskPriority" class="form-label">Приоритет</label>
                    <select class="form-select" id="taskPriority">
                        <option value="Low">Низкий</option>
                        <option value="Medium">Средний</option>
                        <option value="High">Высокий</option>
                    </select>
                </div>
                <div id="subordinateSection" class="mb-3 d-none">
                    <label for="taskAssignee" class="form-label">Назначить подчиненному</label>
                    <select class="form-select" id="taskAssignee">
                        <!-- Список подчиненных -->
                    </select>
                </div>
                <button type="submit" class="btn btn-primary">Создать</button>
            </form>
        </div>
    </div>
</div>
</div>
`;
dynamicContent.innerHTML = tasksHTML;
insertTasks(JSON.parse(localStorage.getItem('taskUser')));*/
console.log("here will be task");
}

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
