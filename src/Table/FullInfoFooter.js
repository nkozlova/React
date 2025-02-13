export default function FullInfoFooter({ row }) {
    return (
        <>
            <h1>Active Row Data: </h1>
            <p>First name: { row.name.first }</p>
            <p>Last name: {row.name.last}</p>
            <p>Email: {row.email}</p>
            <p>Phone: {row.phone}</p>
        </>
    );
}