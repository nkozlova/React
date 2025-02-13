import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import BasePage, { Modal } from './BaseComponent.js';
import assert from 'assert';


// Модалка для добавления-редактирования
function AddEditPhotoModal({ onClose, onAddEdit, photo = null }) {
    const [title, setTitle] = useState(photo !== null ? photo.title : "");
    const [url, setUrl] = useState(photo !== null ? photo.url : "");

    function handleAddPhoto() {
        assert(photo == null);
        onAddEdit(title, url);
    }

    function handleEditPhoto() {
        assert(photo);
        onAddEdit(photo, title, url);
    }

    return (
        <Modal
            title={photo ? "Update Photo" : "Add Photo"}
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
                        <span class="input-group-text" id="inputGroup-sizing-default">Image url</span>
                    </div>
                    <input
                        type="text"
                        class="form-control"
                        aria-label="Default"
                        aria-describedby="inputGroup-sizing-default"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                </div>

                <button
                    class="btn btn-light"
                    onClick={photo ? handleEditPhoto : handleAddPhoto}
                    disabled={title === "" || url === "" || photo !== null && title === photo.title && url === photo.url}
                >
                    {url ? "Update" : "Add"}
                </button>

            </div>
        </Modal>
    );
}


// Список всех карточек
export default function PhotosPage() {
    function buildPhoto(id, title, url) {
        return { id: id, title: title, url: url };
    }

    return <BasePage
        dataUrl='https://jsonplaceholder.typicode.com/photos'
        buildDataContent={(data, full) =>
            <div>
                <h5 class={full ? "card-title-full" : "card-title"}>{data.title}</h5>
                <img url={data.url} />
            </div>
        }
        title="Photo List"
        addEditModal={(onCloseFunc, onAddEditFunc, photo = null) =>
            <AddEditPhotoModal
                onClose={onCloseFunc}
                onAddEdit={(...args) => onAddEditFunc(buildPhoto, ...args)}
                photo={photo} />}
    />;
}
