import React, { useState } from 'react';

export default function AddDataForm({onAddData}) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    function handleAddData() {
        onAddData({ firstName, lastName, email, phone });
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
    }

    return (
        <div>
            <input placeholder="First Name" value={firstName} onChange={(e)=>setFirstName(e.target.value)}/>
            <input placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <button onClick={handleAddData} disabled={!firstName || !lastName || !email}>Add</button>
        </div>
    );
}