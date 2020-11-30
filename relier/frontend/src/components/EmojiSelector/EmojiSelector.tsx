import React, { useReducer, useRef, useState } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/lab/ToggleButton";

import { useStyles } from "./../../style";
import reactions from "./../Reactions/Reactions";
import "./EmojiSelector.css";
import { EmojiFlagsTwoTone } from "@material-ui/icons";

const TIMEOUT = 60000;
// TODO: Update
//const numberOfEmojis = 19;

//type State = {
//isSelected: Array<string>;
//};

//const initialState: State = {
//isSelected: new Array<string>(),
//};

//type Action = { type: "setSelected"; payload: string };

//const reducer = (state: State, action: Action): State => {
//switch (action.type) {
//case "setSelected":
//let emojiToChange = action.payload;
//if (state.isSelected.length === 5) {
//const emojiPopped = state.isSelected.pop();
//}
//let newSelected = state.isSelected;
//newSelected[id] = !newSelected[id];

//return {
//...state,
//isSelected: newSelected,
//};
//}
//};

export default function EmojiSelector({
  sendEmoji,
}: {
  sendEmoji: (emoji: string, diection: string) => void;
}) {
  const classes = useStyles();
  let elements: JSX.Element[] = [];
  //TO DO:
  // selectedEmoji needs to be an OBJECT
  // { name: emoji name, timeOutID: unique identified of the timeOut we schedule to remove thsi emoji}
  //
  // TO DO: when you UNCLICK, you cancel the timeout BEFORE removing it from the list!!

  const [selectedEmojis, setSelectedEmoji] = useState<
    {
      emoji: string;
      timeoutId: ReturnType<typeof setTimeout>;
    }[]
  >([]);

  const selectedEmojiRef = useRef(selectedEmojis);
  selectedEmojiRef.current = selectedEmojis;

  const undoReaction = (reaction: string) => {
    console.log("Reaction to undo: ", reaction, "Emoji list: ", selectedEmojis);
    const newEmojiList = [...selectedEmojiRef.current];
    const indexOfNewEmoji = newEmojiList.findIndex(
      ({ emoji }) => emoji === reaction
    );
    const [{ timeoutId }] = newEmojiList.splice(indexOfNewEmoji, 1);
    clearTimeout(timeoutId);
    sendEmoji(reaction, "down");
    setSelectedEmoji(newEmojiList);
  };
  const handleReactionClick = (reaction: string) => {
    const indexOfNewEmoji = selectedEmojis.findIndex(
      ({ emoji }) => emoji === reaction
    );
    if (indexOfNewEmoji === -1) {
      if (selectedEmojis.length === 5) {
        undoReaction(selectedEmojis[4].emoji);
      }
      const newEmoji = {
        emoji: reaction,
        timeoutId: setTimeout(() => undoReaction(reaction), TIMEOUT),
      };
      sendEmoji(reaction, "up");
      setSelectedEmoji((currentEmojiList) =>
        [newEmoji].concat(currentEmojiList)
      );
    } else undoReaction(reaction);
  };

  // Populate emoji reaction buttons in grid
  reactions.forEach((reaction) => {
    elements.push(
      <Grid key={reaction.id}>
        <Button
          className={classes.reactionButton}
          value="check"
          selected={selectedEmojis.some(({ emoji }) => emoji === reaction.id)}
          onClick={() => handleReactionClick(reaction.id)}
        >
          <img
            className={classes.imageButton}
            src={"./assets/" + reaction.id + ".png"}
            alt={reaction.alt}
            title={reaction.alt}
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
