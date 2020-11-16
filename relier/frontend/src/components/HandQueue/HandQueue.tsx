import React, { useState } from "react";
import Button from "@material-ui/lab/ToggleButton";
import PanToolIcon from "@material-ui/icons/PanTool";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import { useStyles } from "./../../style";
import "./HandQueue.css";

export default function RaiseHandButton({ sendHand, role }: any) {
  const classes = useStyles();
  const [raised, setRaised] = useState<boolean>(false);

  const handleChange = () => {
    setRaised(!raised);
    sendHand();
  };

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          {role === "presenter" ? (
            "Should be updated"
          ) : (
            <>
              <Button onChange={handleChange} selected={raised}>
                <PanToolIcon />
              </Button>
              <h4>
                {" "}
                {raised
                  ? "You're next!"
                  : "Raise your hand if you have a question"}{" "}
              </h4>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
