import { usePresence } from "@roomservice/react";
import React, { useEffect, useState } from "react";
import Cursor from "../components/cursor";
import useInterval from "../hooks/use-interval";
import useMousePosition from "../hooks/use-mouse-position";
import useUserID from "../hooks/use-user-id";

const COLORS = ["#eb0fc6", "#E98A15", "#003B36", "#012622"];

const pickRandom = (list) => list[Math.floor(Math.random() * list.length)];

interface CursorData {
  x: number | null;
  y: number | null;
  color: string;
  name: string;
}

export default function Home() {
  const { x, y } = useMousePosition();
  const [cursors, cursorsClient] = usePresence("cursors-room", "joined");
  const [showSelf, setShowSelf] = useState(true);
  const [color, setColor] = useState(null);
  const [name, setName] = useState("Anonymous");

  const userId = useUserID();

  useEffect(() => {
    setColor(pickRandom(COLORS));
  }, []);

  useInterval(() => {
    cursorsClient.set({ x, y, color, name });
  }, 25);

  return (
    <div className="window">
      <div>Cursors online: {Object.keys(cursors).length}</div>
      <label style={{ display: "block", marginTop: "0.25rem" }}>
        Show self:
        <input
          type="checkbox"
          onChange={(e) => setShowSelf(e.target.checked)}
          checked={showSelf}
        />
      </label>
      <label style={{ display: "block", marginTop: "0.25rem" }}>
        My name:{" "}
        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      </label>

      <div style={{ marginTop: "10rem" }}>
        Created with{" "}
        <a href="https://roomservice.dev">https://roomservice.dev</a> 🤩
      </div>
      <div style={{ marginTop: "0.25rem" }}>
        Github:{" "}
        <a href="https://github.com/lawrencecchen/figma-cursors">
          https://github.com/lawrencecchen/figma-cursors
        </a>
      </div>
      <div style={{ marginTop: "0.25rem", fontStyle: "italic" }}>
        Not seeing yourself w/ multiple tabs? Use incognito.
      </div>
      {Object.entries(cursors)
        .filter(([key, _]) => showSelf || key !== userId)
        .map(([userId, cursor]: [string, CursorData]) => (
          <div
            key={userId}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              transition: "transform 0.025s ease-out",
              transform: `translate3d(${cursor?.x - 3}px, ${
                cursor?.y - 3
              }px, 0px)`,
              color: cursor?.color || "black",
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            <Cursor />
            <div
              style={{
                backgroundColor: cursor?.color,
                position: "absolute",
                transform: "translate3d(30px, -10px, 0px)",
                color: "white",
                padding: "0.2rem 0.25rem",
                fontSize: "0.75rem",
                maxWidth: "8rem",
                maxHeight: "4rem",
                overflow: "auto",
              }}
            >
              {cursor?.name.length > 0 ? cursor.name : "Anonymous"}
            </div>
          </div>
        ))}
    </div>
  );
}
