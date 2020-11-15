import React from "react";
import "./App.css";
import { useState } from "react";
import { UserInfo } from "./types";
import { darkTheme } from "./style";
import { ThemeProvider } from "@material-ui/core/styles";

import LandingPage from "./components/LandingPage/LandingPage";
import MainPage from "./MainPage";

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
    //TO DO: package all this up in another component "MainPage"
    <ThemeProvider theme={darkTheme}>
      <div className="App">
        <MainPage userInfo={userInfo} />
      </div>
    </ThemeProvider>
  );
}

export default App;
