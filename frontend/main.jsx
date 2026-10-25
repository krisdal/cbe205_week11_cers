import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
const base = "http://localhost:3001";
function App() {
    const [events, setEvents] = useState([]);
    const [message, setMessage] = useState("");
    async function load() {
        try {
            const response = await fetch(base + "/api/events");
            if (!response.ok) throw Error("API error");
            setEvents(await response.json());
        } catch (e) {
            setMessage(e.message);
        }
    }
    useEffect(() => {
        load();
    }, []);
    async function register(id) {
        try {
            const response = await fetch(
                `${base}/api/events/${encodeURIComponent(id)}/registrations`,
                { method: "POST" },
            );
            const data = await response.json();
            setMessage(
                response.ok
                    ? `Registration confirmed: ${data.registration_id}`
                    : data.error,
            );
            await load();
        } catch (e) {
            setMessage(e.message);
        }
    }
    return (
        <>
            <h1>Campus Event Registration</h1>
            <p>Week 11 demo — predefined student S001</p>
            {events.map((e) => (
                <article
                    key={e.event_id}
                    style={{
                        background: "white",
                        padding: 20,
                        marginBottom: 14,
                        borderRadius: 12,
                    }}
                >
                    <h2>{e.title}</h2>
                    <p>
                        Status: {e.status} | Seats: {e.capacity - e.registered}/{e.capacity}
                    </p>
                    <button onClick={() => register(e.event_id)}>Register</button>
                </article>
            ))}
            <p role="status">{message}</p>
        </>
    );
}
createRoot(document.getElementById("root")).render(<App />);
