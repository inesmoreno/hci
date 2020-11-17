import React, { useState } from "react";
import Button from "@material-ui/lab/ToggleButton";
import PanToolIcon from "@material-ui/icons/PanTool";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import { useStyles } from "../../style";
import "./HandList.css";

export default function RaiseHandButton({ hands }: any) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          {hands.map(hand => (
            <p>{hand}</p>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
