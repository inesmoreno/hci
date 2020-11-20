import React, { useReducer } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/lab/ToggleButton";

import { useStyles } from "./../../style";
import reactions from "./../Reactions/Reactions";
import "./EmojiSelector.css";

// TODO: Update
const numberOfEmojis = 19;

type State = {
  isSelected: Array<boolean>;
};

const initialState: State = {
  isSelected: new Array<boolean>(numberOfEmojis).fill(false)
};

type Action = { type: "setSelected"; payload: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "setSelected":
      let id = action.payload;
      let newSelected = state.isSelected;
      newSelected[id] = !newSelected[id];

      return {
        ...state,
        isSelected: newSelected
      };
  }
};

export default function Index({ handleChange }: any) {
  const classes = useStyles();
  let elements: JSX.Element[] = [];
  const [state, dispatch] = useReducer(reducer, initialState);

  const setSelected = event => {
    dispatch({
      type: "setSelected",
      payload: event.target.id
    });
  };

  // Populate emoji reaction buttons in grid
  // let id = 0;

  reactions.map((reaction, index) => {
    elements.push(
      <Grid item key={index}>
        <Button
          className={classes.reactionButton}
          value="check"
          selected={state.isSelected[index]}
          onChange={setSelected}
          onClick={() => handleChange(index)}
        >
          <img
            className={classes.imageButton}
            id={index.toString()}
            src={"./assets/" + reaction + ".png"}
          />
        </Button>
      </Grid>
    );
  });

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <Grid container direction="row" justify="flex-start" spacing={1}>
            {elements}
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}
