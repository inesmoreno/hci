import React, { useState } from "react";
import Button from "@material-ui/lab/ToggleButton";
import PanToolIcon from "@material-ui/icons/PanTool";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import { useStyles } from "../../style";
import "./HandList.css";
//FOR THE PRESENTER
export default function RaiseHandButton({ hands, removeHand, clearHand }: any) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <h3> Hand Raise Queue </h3>
        <CardContent className={classes.cardContent}>
          {<Button onClick={() => clearHand()}>Clear queue</Button>}
          {hands.map((hand) => (
            <>
              <p>{hand}</p>
              <Button onClick={() => removeHand(hand)}>X</Button>
            </>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
