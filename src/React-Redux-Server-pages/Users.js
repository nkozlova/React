import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import BasePage, { Modal } from './BaseComponent.js';
import assert from 'assert';


// Модалка для добавления-редактирования
function AddEditUserModal({ onClose, onAddEdit, user = null }) {
    const [name, setName] = useState(user !== null ? user.name : "");
    const [username, setUsername] = useState(user !== null ? user.username : "");
    const [email, setEmail] = useState(user !== null ? user.email : "");
    const [phone, setPhone] = useState(user !== null ? user.phone : "");
    const [website, setWebsite] = useState(user !== null ? user.website : "");

    function handleAddUser() {
        assert(user == null);
        onAddEdit(name, username, email, phone, website);
    }

    function handleEditUser() {
        assert(user);
        onAddEdit(user, name, username, email, phone, website);
    }

    return (
        <Modal
            title={user ? "Update User" : "Add User"}
            onClose={onClose}
        >
            <div class="card-body">

                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="inputGroup-sizing-default">Name</span>
                    </div>
                    <input
                        type="text"
                        class="form-control"
                        aria-label="Default"
                        aria-describedby="inputGroup-sizing-default"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="inputGroup-sizing-default">Username</span>
                    </div>
                    <input
                        type="text"
                        class="form-control"
                        aria-label="Default"
                        aria-describedby="inputGroup-sizing-default"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="inputGroup-sizing-default">Email</span>
                    </div>
                    <input
                        type="text"
                        class="form-control"
                        aria-label="Default"
                        aria-describedby="inputGroup-sizing-default"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="inputGroup-sizing-default">Phone</span>
                    </div>
                    <input
                        type="text"
                        class="form-control"
                        aria-label="Default"
                        aria-describedby="inputGroup-sizing-default"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>

                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="inputGroup-sizing-default">Website</span>
                    </div>
                    <input
                        type="text"
                        class="form-control"
                        aria-label="Default"
                        aria-describedby="inputGroup-sizing-default"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                    />
                </div>

                <button
                    class="btn btn-light"
                    onClick={user ? handleEditUser : handleAddUser}
                    disabled={name === "" || username === "" || email === "" || phone === "" ||
                        user !== null && name === user.name && username === user.username
                            && email === user.email && phone === user.phone && website === user.website}
                >
                    {user ? "Update" : "Add"}
                </button>

            </div>
        </Modal>
    );
}


// Список всех карточек
export default function UsersPage() {
    function buildUser(id, name, username, email, phone, website) {
        return { id: id, name: name, username: username, email: email, phone: phone, website: website };
    }

    return <BasePage
        dataUrl='https://jsonplaceholder.typicode.com/users'
        buildDataContent={(data, full) =>
            <div>
                <h5 class={full ? "card-title-full" : "card-title"}>{data.name}</h5>
                <p class={full ? "card-text-full" : "card-text"}>Email: {data.email}</p>
                <p class={full ? "card-text-full" : "card-text"}>Phone: {data.phone}</p>
                {full &&
                    <div>
                        <p class={"card-text-full"}>Username: {data.username}</p>
                        <p class={"card-text-full"}>Website: {data.website}</p>
                    </div>
                }
            </div>
        }
        title="User List"
        addEditModal={(onCloseFunc, onAddEditFunc, user = null) =>
            <AddEditUserModal
                onClose={onCloseFunc}
                onAddEdit={(...args) => onAddEditFunc(buildUser, ...args)}
                user={user} />}
    />;
}
