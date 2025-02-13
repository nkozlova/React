import React, { useState, useEffect } from 'react';
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
const Modal = ({ title, onClose, children }) => {
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

// Одна карточка: заголовок, описание, модалки для полного просмотра и для редактирования, изменение цветовой темы, удаление
function Article({ article, smallSize, updateArticle, deleteArticle }) {
    const [theme, setTheme] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);

    return (
        <div>
            <div class={Themes[theme].Card} style={{ width: (smallSize ? 280 : 380) }}>
                <div class="card-body">
                    <h5 class="card-title">{article.title}</h5>
                    <p class="card-text">{article.body}</p>
                    <button
                        class={Themes[theme].Button}
                        onClick={() => setIsModalOpen(true)}
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
                        onClick={() => setEditModalOpen(true)}
                    >
                        Edit
                    </button>
                    <button
                        class={Themes[theme].Button}
                        onClick={() => deleteArticle(article.id)}
                    >
                        Delete
                    </button>
                </div>
            </div>


            {isModalOpen &&
                <Modal
                    title="Article Info"
                    onClose={() => setIsModalOpen(false)}
                >
                    <div class="card-body">
                        <h5 class="card-title-full">{article.title}</h5>
                        <p class="card-text-full">{article.body}</p>
                    </div>
                </Modal>
            }

            {editModalOpen &&
                <UpdateArticleModal
                onClose={() => setEditModalOpen(false)}
                article={article}
                updateArticle={updateArticle}
                />}
        </div>
    );
}

// Модалка новой карточки
function AddArticleModal({ onClose, addNewArticle }) {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    function handleAddArticle() {
        addNewArticle(title, body);
        onClose();
    }

    return (
        <Modal
            title="Add New Article"
            onClose={onClose}
        >
            <div class="card-body">

                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="inputGroup-sizing-default">Title</span>
                    </div>
                    <input
                        type="text"
                        class="form-control"
                        aria-label="Default"
                        aria-describedby="inputGroup-sizing-default"
                        value={title}
                        onChange={(e)=>setTitle(e.target.value)}
                    />
                </div>

                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="inputGroup-sizing-default">Body</span>
                    </div>
                    <textarea
                        className="input-textarea"
                        rows="3"   // Specifies the number of rows (3 rows)
                        cols="50"  // Specifies the number of columns (width)
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                    />
                </div>

                <button
                    class="btn btn-light"
                    onClick={handleAddArticle}
                    disabled={title === "" || body === ""}
                >
                    Add
                </button>

            </div>
        </Modal>
    );
}

// Аналогичная модалка для редактирования
function UpdateArticleModal({ onClose, article, updateArticle }) {
    const [title, setTitle] = useState(article.title);
    const [body, setBody] = useState(article.body);

    function handleUpdateArticle() {
        updateArticle(article.id, title, body);
        onClose();
    }

    return (
        <Modal
            title="Update Article" 
            onClose={onClose}
        >
            <div class="card-body">

                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="inputGroup-sizing-default">Title</span>
                    </div>
                    <input
                        type="text"
                        class="form-control"
                        aria-label="Default"
                        aria-describedby="inputGroup-sizing-default"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="inputGroup-sizing-default">Body</span>
                    </div>
                    <textarea
                        className="input-textarea"
                        rows="3"   // Specifies the number of rows (3 rows)
                        cols="50"  // Specifies the number of columns (width)
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                    />
                </div>

                <button
                    class="btn btn-light"
                    onClick={handleUpdateArticle}
                    disabled={title === "" || body === "" || title === article.title && body === article.body}
                >
                    Update
                </button>

            </div>
        </Modal>
    );
}

// Список всех карточек
export default function Articles() {
    const [articles, setArticles] = useState([]);
    const [showedCount, setShowedCount] = useState(3);
    const [smallSize, setSmallSize] = useState(true);
    const [addModal, setAddModalOpen] = useState(false);
    const [nextId, setNextId] = useState();

    // Получеаем от сервера данные
    useEffect(() => {
        const fetchData = async () => {
            const result = await axios(
                'https://jsonplaceholder.typicode.com/posts',
            );
            setArticles(result.data);
            setNextId(articles.length + 1); // Находим подходящий id, с которым создадим новую карточку
        };
        fetchData();
    }, []);

    // Список отображаемых карт, тройками
    let showedArticles = [];
    for (let i = 0; i < showedCount && i < articles.length; i++) {
        showedArticles.push(
            <Article
                article={articles[i]}
                smallSize={smallSize}
                key={articles[i].id}
                updateArticle={(id, title, body) => handleUpdateArticle(id, title, body)}
                deleteArticle={(id) => handleDeleteArticle(id)}
            />);
    }

    function handleAddArticle(title, body) {
        let nextArticles = articles.slice();
        nextArticles.push({
            "id": nextId,
            "title": title,
            "body": body
        });
        setArticles(nextArticles);
        setNextId(nextId + 1);
    }

    function handleUpdateArticle(id, title, body) {
        let nextArticles = articles.slice();
        const index = nextArticles.findIndex(item => item.id === id);
        assert(index >= 0);
        nextArticles[index].title = title;
        nextArticles[index].body = body;
        setArticles(nextArticles);
    }

    function handleDeleteArticle(id) {
        let nextArticles = articles.slice();
        const index = nextArticles.findIndex(item => item.id === id);
        assert(index >= 0);
        nextArticles.splice(index, 1);
        setArticles(nextArticles);
    }

    return (
        <div className="content">
            <div>
                <h1>Article List</h1>

                <button type="button" class="btn btn-primary"
                    onClick={() => { setSmallSize(!smallSize) }}
                >
                    {smallSize ? "Make big size" : "Make small size"}
                </button>
                <button type="button" class="btn btn-primary"
                    onClick={() => setAddModalOpen(true)}
                >
                    Add Article
                </button>
            </div>

            <div className="board">
                {showedArticles}
            </div>

            <div>
                {showedCount < articles.length &&
                    <button type="button" class="btn btn-primary"
                        onClick={() => { setShowedCount(showedCount + 3) }}
                    >
                        More
                    </button>
                }
            </div>

            {addModal &&
                <AddArticleModal
                onClose={() => setAddModalOpen(false)}
                addNewArticle={(title, body) => handleAddArticle(title, body)}
                />}
        </div>
    );
}
