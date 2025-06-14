let todoItemsContainer = document.getElementById("todoItemsContainer");
let addTodoButton = document.getElementById("addTodoButton");

function getListFromLocalStorage() {
    let stringifiedList = localStorage.getItem('todoList');
    let parsedTodoList = JSON.parse(stringifiedList);
    if (parsedTodoList === null) {
        return [];
    } else {
        return parsedTodoList;
    }
}

let todoList = getListFromLocalStorage();
let buttonEl = document.getElementById('saveTodoButton');
buttonEl.onclick = function() {
    localStorage.setItem('todoList', JSON.stringify(todoList));
}

let todosCount = todoList.length;

function onTodoStatusChange(checkboxId, labelId, todoId) {
    let checkboxElement = document.getElementById(checkboxId);
    let labelElement = document.getElementById(labelId);
    labelElement.classList.toggle('checked');
    let todoObjIndex = todoList.findIndex(function(eachTodo) {
        let eachTodoId = 'todo' + eachTodo.uniqueNo;
        if (eachTodoId === todoId) {
            return true;
        } else {
            return false;
        }
    });
    let todoObj = todoList[todoObjIndex];
    if (todoObj.isChecked === true) {
        todoObj.isChecked = false;
    } else {
        todoObj.isChecked = true;
    }
}

function onDeleteTodo(todoId) {
    try {
        let todoElement = document.getElementById(todoId);
        if (todoElement && todoElement.parentNode) {
            todoElement.parentNode.removeChild(todoElement);
        }
        
        let deleteItemIndex = todoList.findIndex(function(eachTodo) {
            let eachTodoId = 'todo' + eachTodo.uniqueNo;
            return eachTodoId === todoId;
        });

        if (deleteItemIndex !== -1) {
            todoList.splice(deleteItemIndex, 1);
        }
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
}

function createAndAppendTodo(todo) {
    let todoId = 'todo' + todo.uniqueNo;
    let checkboxId = 'checkbox' + todo.uniqueNo;
    let labelId = 'label' + todo.uniqueNo;

    let todoElement = document.createElement("li");
    todoElement.classList.add("todo-item-container", "d-flex", "flex-row");
    todoElement.id = todoId;
    todoItemsContainer.appendChild(todoElement);

    let inputElement = document.createElement("input");
    inputElement.type = "checkbox";
    inputElement.id = checkboxId;
    inputElement.checked = todo.isChecked;
    inputElement.onclick = function() {
        onTodoStatusChange(checkboxId, labelId, todoId);
    }
    inputElement.classList.add("checkbox-input");
    todoElement.appendChild(inputElement);

    let labelContainer = document.createElement("div");
    labelContainer.classList.add("label-container", "d-flex", "flex-row");
    todoElement.appendChild(labelContainer);

    let labelElement = document.createElement("label");
    labelElement.setAttribute("for", checkboxId);
    labelElement.id = labelId;
    labelElement.classList.add("checkbox-label");
    labelElement.textContent = todo.text;
    labelContainer.appendChild(labelElement);
    if (todo.isChecked === true) {
        labelElement.classList.add('checked');
    }

    let deleteIconContainer = document.createElement("div");
    deleteIconContainer.classList.add("delete-icon-container");
    labelContainer.appendChild(deleteIconContainer);

    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fas", "fa-trash-alt", "delete-icon");
    deleteIcon.style.cursor = "pointer";
    deleteIcon.style.fontSize = "1.2rem";
    deleteIcon.style.color = "#e74c3c";
    
    // Add click event listener to the delete icon
    deleteIcon.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        onDeleteTodo(todoId);
    });

    deleteIconContainer.appendChild(deleteIcon);
}

// Initialize existing todos
for (let todo of todoList) {
    createAndAppendTodo(todo);
}

function onAddTodo() {
    let userInputElement = document.getElementById("todoUserInput");
    let userInputValue = userInputElement.value;

    if (userInputValue === "") {
        alert("Enter Valid Text");
        return;
    }

    todosCount = todosCount + 1;

    let newTodo = {
        text: userInputValue,
        uniqueNo: todosCount,
        isChecked: false
    };
    todoList.push(newTodo);
    createAndAppendTodo(newTodo);
    userInputElement.value = "";
}

addTodoButton.onclick = function() {
    onAddTodo();
}