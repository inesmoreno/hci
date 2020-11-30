import React, { useState } from "react";
import Button from "@material-ui/lab/ToggleButton";
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
        <div className="subheading">
          <div className="title">  </div>
          <Button className="clearAll" onClick={() => clearHand()}>
            Clear queue
          </Button>
        </div>
        <CardContent className={classes.cardContent}>
          <div className="personInqueue">
            {hands.length ? (
              hands.map(hand => (
                <>
                  {hand}
                  <Button
                    className="clearEach"
                    onClick={() => removeHand(hand)}
                  >
                    X
                  </Button>
                  <br></br>
                </>
              ))
            ) : (
              <div style={{ textAlign: "center" }}> No one in the queue </div>
            )}{" "}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
