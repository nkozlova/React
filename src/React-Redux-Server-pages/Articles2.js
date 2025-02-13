import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import BasePage, { Modal } from './BaseComponent.js';
import assert from 'assert';


// Модалка для добавления-редактирования
function AddEditArticleModal({ onClose, onAddEdit, article=null }) {
    const [title, setTitle] = useState(article !== null ? article.title : "");
    const [body, setBody] = useState(article !== null ? article.body : "");

    function handleAddArticle() {
        assert(article == null);
        onAddEdit(title, body);
    }

    function handleEditArticle() {
        assert(article);
        onAddEdit(article, title, body);
    }

    return (
        <Modal
            title={article ? "Update Article" : "Add Article"}
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
                    onClick={article ? handleEditArticle : handleAddArticle}
                    disabled={title === "" || body === "" || article !== null && title === article.title && body === article.body}
                >
                    {article ? "Update" : "Add"}
                </button>

            </div>
        </Modal>
    );
}


// Список всех карточек
export default function ArticlesPage() {
    function buildArticle(id, title, body) {
        return { id: id, title: title, body: body };
    }

    return <BasePage
        dataUrl='https://jsonplaceholder.typicode.com/posts'
        buildDataContent={(data, full) =>
            <div>
                <h5 class={full ? "card-title-full" : "card-title"}>{data.title}</h5>
                <p class={full ? "card-text-full" : "card-text"}>{data.body}</p>
            </div>
        }
        title="Article List"
        addEditModal={(onCloseFunc, onAddEditFunc, article=null) =>
            <AddEditArticleModal
                onClose={onCloseFunc}
                onAddEdit={(...args) => onAddEditFunc(buildArticle, ...args)}
                article={article} />}
    />;
}
