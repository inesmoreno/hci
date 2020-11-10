import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';

import { useStyles } from './../../style';
import reactions from './../Reactions/Reactions'

export default function Index() {
  const classes = useStyles();
  var elements:JSX.Element[] = [];

  var id = 1;

  reactions.forEach((reaction) => {
    elements.push(
      <Grid item className={classes.gridItem}>
        <img
          key={id}
          src={"./assets/" + reaction + ".png"}
          height="20"/>
      </Grid>
    );
    id++;
  });

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardContent>
          <Grid
            container
            direction='row'
            justify='flex-start'
            align-Items='start'
            spacing={1}
          >
            {elements}
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}