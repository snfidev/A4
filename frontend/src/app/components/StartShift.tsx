"use client";

import { useEffect, useState } from "react";

console.log("StartShift mounted");

interface User {
  Id: number;
  Title: string;
}

export default function StartShift() {
  const [users, setUsers] = useState<User[]>([]);
  const [szalagId, setSzalagId] = useState<number | null>(null);
  const [muszerId, setMuszerId] = useState<number | null>(null);

  // --- Load users (hardcoded for now) ---
  useEffect(() => {
    const data = [
      { Id: 1, Title: "Alice" },
      { Id: 2, Title: "Bob" },
      { Id: 3, Title: "Charlie" },
    ];
    setUsers(data);
  }, []);

  // --- Create shift by calling backend ---
  const createShift = async () => {
    try {
      if (!szalagId || !muszerId) {
        alert("Select both Szalagvezető and Műszerész");
        return;
      }

      const selectedSzalag = users.find((u) => u.Id === szalagId)?.Title;
      const selectedMuszer = users.find((u) => u.Id === muszerId)?.Title;

      const res = await fetch("http://localhost:5010/api/Shifts/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          szalagvezeto: selectedSzalag,
          muszerez: selectedMuszer,
        }),
      });

      console.log("STATUS:", res.status);

      const text = await res.text();
      console.log("RAW RESPONSE:", text);

      alert("Check console");
    } catch (err) {
      console.error("FULL ERROR:", err);
      alert("Fetch failed completely");
    }
  };

  return (
    <div style={{ border: "2px solid red", padding: 10, margin: 10 }}>
      <h2>Start Shift</h2>

      <div>
        <label>Szalagvezető:</label>
        <select onChange={(e) => setSzalagId(Number(e.target.value))}>
          <option value="">Select</option>
          {users.map((user) => (
            <option key={user.Id} value={user.Id}>
              {user.Title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Műszerész:</label>
        <select onChange={(e) => setMuszerId(Number(e.target.value))}>
          <option value="">Select</option>
          {users.map((user) => (
            <option key={user.Id} value={user.Id}>
              {user.Title}
            </option>
          ))}
        </select>
      </div>

      <button onClick={createShift}>Start Shift</button>
    </div>
  );
}
