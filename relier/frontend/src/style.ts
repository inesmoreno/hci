import {
  createStyles,
  makeStyles,
  Theme,
  createMuiTheme,
} from "@material-ui/core/styles";

export const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#00FFE0",
    },
    secondary: {
      main: "#FFF",
    },
  },
});

const buttonSize = "35px";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    palette: {
      type: "dark",
    },
    root: {
      flexGrow: 1,
    },
    container: {
      display: "flex-center",
      flexWrap: "wrap",
      width: 400,
      margin: `${theme.spacing(0)} auto`,
      textColor: "#FFF",
    },
    joinBtn: {
      marginTop: theme.spacing(2),
      flexGrow: 1,
    },
    createBtn: {
      marginTop: theme.spacing(2),
      flexGrow: 1,
    },
    card: {
      marginTop: theme.spacing(10),
      color: "#FFF",
    },
    cardContent: {
      backgroundColor: "#202223",
    },
    reactionButton: {
      height: buttonSize,
      width: buttonSize,
    },
    imageButton: {
      height: buttonSize,
      width: buttonSize,
      padding: "5px",
    },
  })
);
