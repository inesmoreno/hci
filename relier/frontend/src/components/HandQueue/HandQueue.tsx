import React, { useState } from "react";
import Button from "@material-ui/lab/ToggleButton";
import PanToolIcon from "@material-ui/icons/PanTool";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import { useStyles } from "./../../style";
import "./HandQueue.css";

export default function RaiseHandButton({ sendHand, role, hands }: any) {
  const classes = useStyles();
  const [raised, setRaised] = useState<boolean>(false);

  const handleChange = () => {
    setRaised(!raised);
    sendHand();
  };

  return (
    <div className={classes.root}>
      {console.log(sendHand)}
      <Card className={classes.card}>
		<h3> Hand Raise Queue </h3>
        <CardContent className={classes.cardContent}>
          <Button onChange={handleChange} selected={raised}>
            <PanToolIcon />
          </Button>
          <h4>
            {" "}
            {raised
              ? "You're next!"
              : "Raise your hand if you have a question"}{" "}
          </h4>
        </CardContent>
      </Card>
    </div>
  );
}
