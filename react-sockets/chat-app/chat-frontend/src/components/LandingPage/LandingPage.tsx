import React, { useReducer, useEffect } from "react";
import {useStyles, darkTheme} from './../../style';
import Box from '@material-ui/core/Box';
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import {ThemeProvider} from "@material-ui/core/styles";
import "./LandingPage.css";
import { UserInfo } from "./../../types";

//state type
type State = {
  username: string;
  meetingId: string;
  isButtonDisabled: boolean;
  helperText: string;
  isError: boolean;
};

const initialState: State = {
  username: "",
  meetingId: "",
  isButtonDisabled: true,
  helperText: "",
  isError: false,
};

type Action =
  | { type: "setUsername"; payload: string }
  | { type: "setIsButtonDisabled"; payload: boolean }
  | { type: "loginSuccess"; payload: string }
  | { type: "loginFailed"; payload: string }
  | { type: "setIsError"; payload: boolean }
  | { type: "setMeetingId"; payload: string }
  ;

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "setUsername":
      return {
        ...state,
        username: action.payload,
      };
    case "setMeetingId":
      return {
        ...state,
        meetingId: action.payload,
      };
    case "setIsButtonDisabled":
      return {
        ...state,
        isButtonDisabled: action.payload,
      };
    case "loginSuccess":
      return {
        ...state,
        helperText: action.payload,
        isError: false,
      };
    case "loginFailed":
      return {
        ...state,
        helperText: action.payload,
        isError: true,
      };
    case "setIsError":
      return {
        ...state,
        isError: action.payload,
      };
  }
};

function LandingPage({
  setUserInfo,
}: {
  setUserInfo: (userInfo: UserInfo) => void;
}) {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.username.trim() && state.meetingId.trim()) {
      //dispatch is how you send actions to store
      dispatch({
        type: "setIsButtonDisabled",
        payload: false,
      });
    } else {
      dispatch({
        type: "setIsButtonDisabled",
        payload: true,
      });
    }
  }, [state.username, state.meetingId]);

  const handleJoin = () => {
    // TODO: Validation
    // if (state.username === "user" && state.meetingId === "123") {
    //   dispatch({
    //     type: "loginSuccess",
    //     payload: "Login Successfully",
    //   });
    // } else {
    //   dispatch({
    //     type: "loginFailed",
    //     payload: "Incorrect meeting ID",
    //   });
    // }

    setUserInfo({ username: state.username, role: "participant" });
  };

  const handleCreate = () => {
    setUserInfo({ username: state.username, role: "presenter" });
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.keyCode === 13 || event.which === 13) {
      state.isButtonDisabled || handleJoin();
    }
  };

  const handleUsernameChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    dispatch({
      type: "setUsername",
      payload: event.target.value,
    });
  };

  const handleMeetingIdChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    dispatch({
      type: "setMeetingId",
      payload: event.target.value,
    });
  };
  return (
    <ThemeProvider theme={darkTheme}>
      <div>
        <p className="header">
          Welcome to
          <h1>Relier</h1>
        </p>

        <form className={classes.container} noValidate autoComplete="off">
          <Card className={classes.card}>
            {/* <CardHeader className={classes.header} title="Login App" /> */}
            <CardContent>
              <div>
                <TextField
                  fullWidth
                  id="username"
                  //   type="name"
                  label="Name"
                  placeholder="Grace Hopper"
                  margin="normal"
                  onChange={handleUsernameChange}
                  onKeyPress={handleKeyPress}
                />
                <TextField
                  error={state.isError}
                  fullWidth
                  id="meetingId"
                  // type="password"
                  label="Meeting ID"
                  placeholder="123 456 789"
                  margin="normal"
                  helperText={state.helperText}
                  onChange={handleMeetingIdChange}
                  onKeyPress={handleKeyPress}
                />

                <Box mt={1}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    color="primary"
                    className={classes.joinBtn}
                    onClick={handleJoin}
                    disabled={state.isButtonDisabled}
                  >
                    Join
                </Button>
                </Box>

                <Box mt={1}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    color="secondary"
                    className={classes.createBtn}
                    onClick={handleCreate}
                    disabled={state.isButtonDisabled}
                  >
                    Create new meeting
                </Button>
                </Box>
               
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </ThemeProvider>
  );
}

// export default Login;

export default LandingPage;
