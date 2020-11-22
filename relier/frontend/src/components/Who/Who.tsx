import React from "react";
import "./Who.css";

export default function Index({ name, sendName, username }: any) {
  return (
    <div className="who">
      <div onClick={() => sendName(username)}>
        {name.map((v, i) => (
          <div key={i}>{v}</div>
        ))}
      </div>
    </div>
  );
}
