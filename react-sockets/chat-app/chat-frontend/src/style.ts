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
    gridItem: {
      padding: "0px",
      height: "20px",
      marginBottom: "4px",
      marginTop: "4px"
    },
    card: {
      marginTop: theme.spacing(10),
      background: "#202223",
      color: "#FFF",
    },
  })
);