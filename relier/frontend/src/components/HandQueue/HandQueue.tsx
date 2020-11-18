import React, { useState, useEffect } from "react";
import Button from "@material-ui/lab/ToggleButton";
import PanToolIcon from "@material-ui/icons/PanTool";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import { useStyles } from "./../../style";
import "./HandQueue.css";

//TODO:
// print pos in question queue
export default function RaiseHandButton({ sendHand, hands, username }: any) {
  const classes = useStyles();
  const [position, setPosition] = useState<number>(hands.indexOf(username));
  const [raised, setRaised] = useState<boolean>(position >= 0 ? true : false);
  const handleChange = () => {
    setRaised(!raised);
    sendHand(username);
  };
  useEffect(() => {
    console.log(hands);
    setPosition(hands.indexOf(username));
  }, [hands, username]);

  return (
    <div className={classes.root}>
      {console.log(sendHand)}
      <Card className={classes.card}>
        <h3> Hand Raise Queue </h3>
        <CardContent className={classes.cardContent}>
          <Button
            onChange={handleChange}
            selected={position >= 0 ? true : false}
          >
            <PanToolIcon />
          </Button>
          <h4>
            {position >= 0
              ? `You are in position ${position}`
              : "Raise your hand if you have a question"}{" "}
          </h4>
        </CardContent>
      </Card>
    </div>
  );
}
