import React, { useReducer, useEffect } from "react";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import "./LandingPage.css";
import { UserInfo } from "./../../types";
import { useStyles } from "./../../style";

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
  | { type: "setMeetingId"; payload: string };

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
    if (state.meetingId.toUpperCase() !== "HCI") {
      dispatch({
        type: "loginFailed",
        payload: "Incorrect meeting ID",
      });
    } else if (state.username.toUpperCase() === "ADMIN") {
      setUserInfo({ username: state.username, role: "presenter" });
    } else {
      setUserInfo({ username: state.username, role: "participant" });
    }
  };

  // const handleCreate = () => {};

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
    <div>
      <p className="header">
        Welcome to
        <h1>Relier</h1>
      </p>

      <form className={classes.container} noValidate autoComplete="off">
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
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
              {/* Enable only when there is meetingID creation
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
              </Box> */}
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

export default LandingPage;
