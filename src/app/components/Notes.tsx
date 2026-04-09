"use client";

import { useState } from "react";
import styles from "./Notes.module.css";

export default function NotesWidget() {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");

  const handleSave = () => {
    const payload = {
      note,
      timestamp: new Date().toISOString(),
    };

    console.log("Saving note:", payload);

    // TODO: send to SharePoint backend
  };

  return (
    <>
      {/* Floating Button */}
      <div
        className={styles.floatingBtn}
        onClick={() => setOpen(true)}
      >
        📋
      </div>

      {/* Panel */}
      {open && (
        <>
          <div
            className={styles.overlay}
            onClick={() => setOpen(false)}
          />

          <div className={styles.panel}>
            <button
              className={styles.closeBtn}
              onClick={() => setOpen(false)}
            >
              ✕
            </button>

            <h2>Notes</h2>

            <textarea
              className={styles.textarea}
              placeholder="Write anything..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            <button className={styles.saveBtn} onClick={handleSave}>
              Save Note
            </button>
          </div>
        </>
      )}
    </>
  );
}