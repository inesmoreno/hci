import React from "react";
import "./App.css";
import { useState } from "react";
import { UserInfo } from "./types";
import { darkTheme } from "./style";
import { ThemeProvider } from "@material-ui/core/styles";

import Chat from "./components/Chat/Chat";
import LandingPage from "./components/LandingPage/LandingPage";
import EmojiSelector from "./components/EmojiSelector/EmojiSelector";
import Graph from "./components/Graph/Graph";

function App() {
  const [userInfo, setUserInfo] = useState<null | UserInfo>(null);

  if (userInfo === null)
    return (
      <ThemeProvider theme={darkTheme}>
        <div className="App">
          <LandingPage setUserInfo={setUserInfo} />{" "}
        </div>
      </ThemeProvider>
    );

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="App">
        <Graph />
        <EmojiSelector />
        <Chat userInfo={userInfo} />
      </div>
    </ThemeProvider>
  );
}

export default App;
