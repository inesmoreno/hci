import React from "react";
import "./Who.css";

export default function Who({
  name,
  sendName,
  username,
}: {
  name: string[];
  sendName: any;
  username: string;
}) {
  return (
    <div className="who">
      <div onClick={() => sendName(username)}>
        {name.map((name) => (
          <div key={name}>{name}</div>
        ))}
      </div>
    </div>
  );
}
