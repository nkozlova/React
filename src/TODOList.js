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
                placeholder="Add your new TODO item..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") onAdd(); }} // �� ������ ���� ��������� ����� ������� ������
            />
            <button
                className="add-btn"
                onClick={onAdd}>Add</button>
        </div>
    );
}

function ListItem({ todo, index, onToggleToDo, onDeleteToDo }) {
    // ���������� ������� �������� �������� ������ ��� ��������� �� ������ � ���
    const boxRef = React.createRef() // ������� ������ �� ������� (�� �� ������)
    const handleMouseEnter = () => {
        boxRef.current.style.display = "block"; // ����������
    }

    const handleMouseLeave = () => {
        boxRef.current.style.display = "none"; // ��������
    }

    function hangleToggleToDo() {
        onToggleToDo(index);
    }

    const handleDeleteToDo = (event) => {
        event.stopPropagation(); // ���������� �������� ������� -- ��������� �� ���� �� ������, � �� �� ������
        onDeleteToDo(index);
    }

    return (
        <li
            onClick={hangleToggleToDo}
            onMouseEnter={handleMouseEnter} // ����������� ������� ����
            onMouseLeave={handleMouseLeave} >
            <span
                style={{ textDecoration: todo.finished ? "line-through" : "none" }} >
                {todo.name}
            </span>
            <button
                ref={boxRef} // ������
                className="close"
                onClick={handleDeleteToDo}
                style={{ display: "none" }} >
                <img src={closeIcon} className="close-icon" />
            </button>
        </li>
    );
}

function List({ todos, onToggleToDo, onDeleteToDo }) {
    const items = [];

    todos.map((todo, index) => {
        items.push(<ListItem
            key={todo.name}
            todo={todo}
            index={index}
            onToggleToDo={onToggleToDo}
            onDeleteToDo={onDeleteToDo}
        />);
    });

    return (
        <ul>{items}</ul>
    );
}

export default function TODOList() {
    const [todos, setTodos] = useState([{ name: "Item1", finished: false },
        { name: "Clean", finished: true },
        { name: "Write", finished: false },
        { name: "Finish", finished: false },
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

    return (
        <div className="whole-list">
            <Inputs
                onAddToDoItem={(name) => handleAddToDoItem(name)}
            />
            <List
                todos={todos}
                onToggleToDo={(index) => handleToggleToDo(index)}
                onDeleteToDo={(index) => handleDeleteToDo(index)}
            />
        </div>
    );
}
