import { usePresence } from "@roomservice/react";
import React, { useEffect } from "react";
import Cursor from "../components/cursor";
import useInterval from "../hooks/use-interval";
import useMousePosition from "../hooks/use-mouse-position";
import useUserID from "../hooks/use-user-id";

const COLORS = ["#59114D", "#E98A15", "#003B36", "#012622"];

export default function Home() {
  const { x, y } = useMousePosition();
  const [cursors, cursorsClient] = usePresence("cursors-room", "joined");
  const userId = useUserID();

  useInterval(() => {
    cursorsClient.set({ x, y, color: COLORS[0] });
  }, 100);

  // useEffect(() => {
  //   if (cursors[userId]) {
  //     alert("You are signed in on another tab...");
  //   }
  // }, []);

  return (
    <div className="window">
      <button>clck me</button>
      {Object.entries(cursors)
        .filter(([key, _]) => key !== userId)
        .map(([userId, cursor]) => (
          <Cursor
            key={userId}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              transition: "transform 0.1s ease-out",
              transform: `translate3d(${(cursor as any)?.x - 3}px, ${
                (cursor as any)?.y - 3
              }px, 0px)`,
              color: (cursor as any)?.color || "black",
            }}
          />
        ))}
    </div>
  );
}
