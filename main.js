const filters = { All: 1, Active: 2, Completed: 3 };
const CHECKED = 'checked';
const ACTIVE = 'active';
const mobile_size = 640;

let statusView = false;
let newTodoChecked = false;
let newTodo = '';
let todos = [
    { id: 1, text: 'Complete online Javascript course', checked: true },
    { id: 2, text: 'Jog around the park 3x', checked: false },
    { id: 3, text: '10 minutes meditation', checked: false },
    { id: 4, text: 'Read for 1 hour', checked: false },
    { id: 5, text: 'Pick up groceries', checked: false },
    { id: 6, text: 'Complete Todo App on Frontend Mentor', checked: false }
];
let filteredList = [];
let active = 1;
let isMobile = false;

const toggleStatus = () => {
    statusView = !statusView;
    let icon = document.getElementById('status-icon');
    let status = 'light'
    if (statusView) {
        status = 'dark';
        document.getElementById('wrapper').classList.remove('dark');
    }
    else {
        document.getElementById('wrapper').classList.add('dark');
    }
    icon.src = `./assets/icons/${status}-mode.svg`;
};

const show = (element, displaying = 'block') => {
    element.style.display = displaying;
};

const hide = (element) => {
    element.style.display = 'none';
};

const toggleNewTodo = () => {
    newTodoChecked = !newTodoChecked;

    let item = document.getElementById('new_todo-checkbox').parentElement;
    let checked_icon = document.getElementById('new_todo-checkbox-icon');
    let placeholder = document.getElementById('new_todo-placeholder');
    let form = document.getElementById('new_todo-form');

    if (newTodoChecked) {
        item.classList.add(CHECKED);
        show(checked_icon);
        hide(placeholder);
        show(form, 'grid');
    }
    else {
        item.classList.remove(CHECKED);
        hide(checked_icon);
        show(placeholder);
        hide(form);
        form.children[0].value = ''
    }
};

const updateNewTodo = (event) => {
    newTodo = event.target.value;
    let button = document.getElementById('new_todo-addButton');
    if (newTodo.length > 0) {
        button.removeAttribute('disabled');
    }
    else {
        button.setAttribute('disabled', 'disabled');
    }
};

const nextIndex = () => {
    if (!todos.length) return 1;
    return todos[todos.length - 1].id + 1;
};

const addTodo = () => {
    let todo = { id: nextIndex(), text: newTodo, completed: false };
    todos.push(todo);
    createList();
    toggleNewTodo();
};

const toggleChecked = (element, icon, todo) => {
    let current = todos.filter(item => item.id == todo.id)[0];
    current.checked = !current.checked;
    if (current.checked) {
        element.classList.add(CHECKED);
        show(icon);
    }
    else {
        element.classList.remove(CHECKED);
        hide(icon);
    }
    document.getElementById('todos-list').removeChild(document.getElementsByClassName('footer_list')[0]);
    createFooterList();
};

const removeTodo = (todo) => {
    todos = todos.filter(item => item.id != todo.id);
    filteredList = filteredList.filter(item => item.id != todo.id);
    createList();
};

const setPointerCursor = (button) => {
    button.style.cursor = 'pointer';
};

const handleDrag = (item) => {
  const selectedItem = item.target,
        list = selectedItem.parentNode,
        x = event.clientX,
        y = event.clientY;
  
  selectedItem.classList.add('drag-sort-active');
  let swapItem = document.elementFromPoint(x, y) === null ? selectedItem : document.elementFromPoint(x, y);
  
  if (list === swapItem.parentNode) {
    swapItem = swapItem !== selectedItem.nextSibling ? swapItem : swapItem.nextSibling;
    if (swapItem != null) {
        list.insertBefore(selectedItem, swapItem);
    }
  }
};

const handleDrop = (item) => {
  item.target.classList.remove('drag-sort-active');
};

const todoElement = (todo) => {
    let li = document.createElement('li');
    li.className = 'list-group-item todo';
    li.setAttribute('draggable', true)
    li.ondrag = handleDrag;
    li.ondragend = handleDrop;
    if (todo.checked) {
        li.classList.add(CHECKED);
    }

    let icon = document.createElement('img');
    icon.src = './assets/icons/checked.svg';
    todo.checked ? show(icon) : hide(icon);

    let div = document.createElement('div');
    div.classList.add('todo-checkbox');
    div.onclick = function () { toggleChecked(li, icon, todo); }

    div.append(icon);
    li.append(div);

    let label = document.createElement('label');
    label.innerText = todo.text;
    li.append(label);

    let img = document.createElement('img');
    img.src = './assets/icons/close_button.svg';
    setPointerCursor(img);
    img.onclick = function () { removeTodo(todo); }
    li.append(img);
    return li;
}

const unCompleted_cnt = () => {
    return todos.filter(item => !item.checked).length;
}

const clearCompleted = () => {
    todos = todos.filter(item => !item.checked);
    filteredList = filteredList.filter(item => !item.checked);
    createList();
}

const resetActive = () => {
    let buttons = document.getElementById('filtering').children[0].children;
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove(ACTIVE);
    }
};

const filterList = (filter, button) => {
    switch (filter) {
        case Object.keys(filters)[0]:
            filteredList = todos;
            break;
        case Object.keys(filters)[1]:
            filteredList = todos.filter(item => !item.checked);
            break;
        case Object.keys(filters)[2]:
            filteredList = todos.filter(item => item.checked);
            break;
    }
    active = filters[filter];
    resetActive();
    button.classList.add(ACTIVE);
    createList();
}

const createFilters = () => {
    let wrapper = document.createElement('div');
    wrapper.classList.add('filters');

    Object.keys(filters).forEach(filter => {
        let button = document.createElement('button');
        button.innerText = filter;
        button.onclick = function () { filterList(filter, button) };
        if (active == filters[filter]) {
            button.classList.add(ACTIVE);
        }
        wrapper.append(button);
    });
    return wrapper;
}

const createFooterList = () => {
    let li = document.createElement('li');
    li.className = 'list-group-item footer_list';

    let label = document.createElement('label');
    label.innerText = `${unCompleted_cnt()} items left`;
    li.append(label);

    if (isMobile) {
        li.append(createFilters());
    }

    let clear = document.createElement('label');
    clear.innerText = 'Clear Completed';
    setPointerCursor(clear);
    clear.onclick = clearCompleted;
    li.append(clear);
    document.getElementById('todos-list').append(li);
}

const createFiltering = () => {
    let filtering = document.getElementById('filtering');
    if (!isMobile) {
        filtering.innerHTML = '';
        filtering.append(createFilters());
    }
    else hide(filtering);
}

const createList = () => {
    let list = document.getElementById('todos-list');
    list.innerHTML = '';
    filteredList.forEach(todo => {
        list.append(todoElement(todo));
    });
    createFooterList();
};

const updateView = () => {
    let filtering = document.getElementById('filtering');
    (isMobile) ? hide(filtering) : show(filtering);

    document.getElementById('todos-list').removeChild(document.getElementsByClassName('footer_list')[0]);
    createFooterList();
    if (document.getElementById('filtering').innerHTML == '') {
        createFiltering();
    }
}

const handleResize = () => {
    let prev = isMobile;
    isMobile = window.innerWidth <= mobile_size;
    if (prev != isMobile) updateView();
};

window.onload = function () {
    filteredList = todos;
    isMobile = window.innerWidth <= mobile_size;
    createList();
    createFiltering();
    window.addEventListener('resize', handleResize);
};