import React from "react";
import "./Who.css";

export default function Who({
  names,
  sendName,
  username,
}: {
  names: string[];
  sendName: any;
  username: string;
}) {
  return (
    <div className="who" onClick={() => sendName(username)}>
      {names.map((name) => (
        <div key={name}> {name} </div>
      ))}
    </div>
  );
}
