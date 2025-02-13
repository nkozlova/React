import React, { useState, useEffect, Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import assert from 'assert';

// Разные цветовые темы для отображения 
const LightTheme = {
    Card: "card",
    Button: "btn btn-light"
}

const DarkTheme = {
    Card: "card text-white bg-dark",
    Button: "btn btn-dark"
}

const WarningTheme = {
    Card: "card bg-warning",
    Button: "btn btn-warning"
}

const Themes = {
    0: LightTheme,
    1: DarkTheme,
    2: WarningTheme
};

// Основа модалки
export const Modal = ({ title, onClose, children }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div class="card">
                    <div class="card-header">
                        {title}
                        <button
                            class="btn btn-light close"
                            onClick={onClose}
                        >
                            X
                        </button>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

// Основа карточки: размер, изменение цвета, вывод команд редактирования/удаления/просмотра
// content (bool) -> Component -- содержимое карточки, полное или обрезанное, задается из-вне
// команды задаются из - вне
export function BaseCard({ data, content, smallSize, onEdit, onDelete }) {
    const [theme, setTheme] = useState(0);
    const [viewModalOpen, setViewModalOpen] = useState(false);

    return (
        <div>
            <div class={Themes[theme].Card} style={{ width: (smallSize ? 280 : 380) }}>
                <div class="card-body">
                    {content(data, false)}
                    <button
                        class={Themes[theme].Button}
                        onClick={() => setViewModalOpen(true)}
                    >
                        View
                    </button>
                    <button
                        class={Themes[theme].Button}
                        onClick={() => setTheme((theme + 1) % Object.keys(Themes).length)}
                    >
                        Change Color
                    </button>

                    <button
                        class={Themes[theme].Button}
                        onClick={() => onEdit(data)}
                    >
                        Edit
                    </button>
                    <button
                        class={Themes[theme].Button}
                        onClick={() => onDelete(data)}
                    >
                        Delete
                    </button>
                </div>
            </div>

            {viewModalOpen &&
                <Modal
                    title="Info"
                    onClose={() => setViewModalOpen(false)}
                >
                    <div class="card-body">
                        {content(data, true)}
                    </div>
                </Modal>
            }
        </div>
    );
}

// Основа страницы с карточками. Типов данных не знает
// buildCard -- функция, строящая карточку конкретного типа, задается из-вне
export default function BasePage({ dataUrl, buildDataContent, title, addEditModal }) {
    const [datas, setDatas] = useState([]);
    const [showedCount, setShowedCount] = useState(3);
    const [smallSize, setSmallSize] = useState(true);
    const [nextId, setNextId] = useState();
    const [editModalData, setEditModalData] = useState(null);
    const [addModalOpen, setAddModalOpen] = useState(false);

    // Получаем от сервера данные
    useEffect(() => {
        const fetchData = async () => {
            const result = await axios(dataUrl);
            setDatas(result.data); // .slice(0, 4) для сокращения кол-ва данных
            setNextId(datas.length + 1); // Находим подходящий id, с которым создадим новую карточку
        };
        fetchData();
    }, []);

    // Список отображаемых карт, тройками
    let showedDatas = [];
    for (let i = 0; i < showedCount && i < datas.length; i++) {
        showedDatas.push(
            <BaseCard
                key={datas[i].id}
                data={datas[i]}
                content={buildDataContent}
                smallSize={smallSize}
                onEdit={(data) => onEditData(data)}
                onDelete={(data) => handleDeleteData(data)}
            />
        );
    }

    function handleAddData(buildData, ...args) {
        let nextDatas = datas.slice();
        nextDatas.push(buildData(nextId, ...args));
        setDatas(nextDatas);
        setNextId(nextId);
        setAddModalOpen(false);
    }

    function handleDeleteData(data) {
        let nextDatas = datas.slice();
        const index = nextDatas.findIndex(item => item === data);
        assert(index >= 0);
        nextDatas.splice(index, 1);
        setDatas(nextDatas);
    }

    function onEditData(data) {
        setEditModalData(data);
    }

    function handleEditData(buildData, ...args) {
        const [data, ...rest] = args;
        let nextDatas = datas.slice();
        const index = nextDatas.findIndex(item => item === data);
        assert(index >= 0);
        nextDatas[index] = buildData(data.id, ...rest);
        setDatas(nextDatas);
        setEditModalData(null);
    }

    return (
        <div className="content">
            <div>
                <h1>{title}</h1>

                <button type="button" class="btn btn-primary"
                    onClick={() => { setSmallSize(!smallSize) }}
                >
                    {smallSize ? "Make big size" : "Make small size"}
                </button>
                <button type="button" class="btn btn-primary"
                    onClick={() => setAddModalOpen(true)}
                >
                    Add new
                </button>
            </div>

            <div className="board">
                {showedDatas}
            </div>

            <div>
                {showedCount < datas.length &&
                    <button type="button" class="btn btn-primary"
                        onClick={() => { setShowedCount(showedCount + 3) }}
                    >
                        More
                    </button>
                }
            </div>

            {addModalOpen && addEditModal(() => setAddModalOpen(false), handleAddData)}
            {editModalData && addEditModal(() => setEditModalData(null), handleEditData, editModalData)}
        </div>
    );
}
