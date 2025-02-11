import React from 'react';
import './TODOList.css';
import { useState } from 'react';
import closeIcon from './close.png';

function Inputs({ onAddToDoItem }) {
    const [value, setValue] = useState("");

    function onAdd() {
        if (value === "") {
            return;
        }

        onAddToDoItem(value);
        setValue("");
    }

    return (
        <div className="inputs">
            <h1 className="title">To Do List</h1>
            <input
                className="to-do-input"
                placeholder="Add your new To Do item..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") onAdd(); }} // по ентеру тоже добавляем новый элемент списка
            />
            <button
                className="special-btn"
                onClick={onAdd}>Add</button>
        </div>
    );
}

function ListItem({ todo, index, onToggleToDo, onDeleteToDo, onToggleSelection }) {
    // Показываем крестик удаления элемента только при наведении на строку с ним
    const delRef = React.createRef() // Создаем ссылку на элемент (см на кнопку)
    const handleMouseEnter = () => {
        delRef.current.style.display = "block"; // Показываем
    }
    const handleMouseLeave = () => {
        delRef.current.style.display = "none"; // Скрываем
    }

    function hangleToggleToDo() {
        onToggleToDo(index);
    }

    const handleDeleteToDo = (event) => {
        event.stopPropagation(); // Остановить всплытие события -- реагируем на клик по кнопке, а не по строке
        onDeleteToDo(index);
    }

    return (
        <li
            onClick={hangleToggleToDo}
            onMouseEnter={handleMouseEnter} // отслеживаем события мыши
            onMouseLeave={handleMouseLeave}
        >
            <input
                type="checkbox"
                className="checkbox"
                onChange={() => onToggleSelection(index)}
                onClick={(e) => e.stopPropagation()} // Остановить всплытие события -- реагируем на клик по кнопке, а не по строке
                checked={todo.selected}
            />
            <span
                style={{ textDecoration: todo.finished ? "line-through" : "none" }}
            >
                {todo.name}
            </span>
            <button
                ref={delRef} // ссылка
                className="close"
                onClick={handleDeleteToDo}
                style={{ display: "none" }}
            >
                <img src={closeIcon} className="close-icon" />
            </button>
        </li>
    );
}

function List({ todos, onToggleToDo, onDeleteToDo, onToggleSelection }) {
    const items = [];

    todos.map((todo, index) => {
        items.push(<ListItem
            key={todo.name}
            todo={todo}
            index={index}
            onToggleToDo={onToggleToDo}
            onDeleteToDo={onDeleteToDo}
            onToggleSelection={onToggleSelection}
        />);
    });

    return (
        <ul>{items}</ul>
    );
}

export default function TODOList() {
    // todo items
    const [todos, setTodos] = useState([{ name: "Item1", finished: false, selected: false },
        { name: "Clean", finished: true, selected: false },
        { name: "Write", finished: false, selected: true },
        { name: "Finish", finished: false, selected: false },
    ]);

    function handleAddToDoItem(name1) {
        let nextTodos = todos.slice();

        const index = todos.findIndex((e) => e.name === name1);
        if (index != -1) {
            nextTodos[index].finished = false;
        } else {
            nextTodos.push({ name: name1, finished: false });
        }

        setTodos(nextTodos);
    }

    function handleToggleToDo(index) {
        let nextTodos = todos.slice();
        nextTodos[index].finished = !nextTodos[index].finished;
        setTodos(nextTodos);
    }

    function handleDeleteToDo(index) {
        let nextTodos = todos.slice();
        nextTodos.splice(index, 1);
        setTodos(nextTodos);
    }

    function handleToggleSelected(index) {
        let nextTodos = todos.slice();
        nextTodos[index].selected = !nextTodos[index].selected;
        setTodos(nextTodos);
    }

    function handleFinishSelected() {
        let nextTodos = todos.slice();
        nextTodos.forEach(todo => {
            if (todo.selected)
                todo.finished = true;
        });
        setTodos(nextTodos);
    }

    function handleDeleteSelected() {
        let nextTodos = todos.slice();
        for (let i = nextTodos.length - 1; i >= 0; i--) {
            if (nextTodos[i].selected)
                nextTodos.splice(i, 1);
        }
        setTodos(nextTodos);
    }

    function enableFinishButton() {
        return todos.find((todo) => todo.selected && !todo.finished);
    }

    function handleSelectAll() {
        let nextTodos = todos.slice();
        nextTodos.forEach((todo) => {
            todo.selected = true;
        });
        setTodos(nextTodos);
    }

    function handleUnselectAll() {
        let nextTodos = todos.slice();
        nextTodos.forEach((todo) => {
            todo.selected = false;
        });
        setTodos(nextTodos);
    }

    const hasSelection = todos.find((e) => e.selected);
    const hasUnselection = todos.find((e) => !e.selected);

    return (
        <div className="whole-list">
            <Inputs
                onAddToDoItem={(name) => handleAddToDoItem(name)}
            />
            <List
                todos={todos}
                onToggleToDo={(index) => handleToggleToDo(index)}
                onDeleteToDo={(index) => handleDeleteToDo(index)}
                onToggleSelection={(index) => handleToggleSelected(index)}
            />
            <div className="selected-div">
                <button
                    className="special-btn"
                    onClick={handleFinishSelected}
                    disabled={!hasSelection || !enableFinishButton()}
                >
                    Set selected items finished
                </button>
                <button
                    className="special-btn"
                    onClick={handleDeleteSelected}
                    disabled={!hasSelection}
                >
                    Delete selected items
                </button>
            </div>
            <div className="selected-div">
                {hasSelection
                    ? <button
                        className="special-btn"
                        onClick={handleUnselectAll}
                    >
                        Clean selection
                    </button>
                    : <></>
                }
                <button
                    className="special-btn"
                    onClick={handleSelectAll}
                    disabled={!hasUnselection}
                >
                    Select all items
                </button>
            </div>
        </div>
    );
}
