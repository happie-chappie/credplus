import React from "react";
import ReactDOM from "react-dom";
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
// import { lightBlue } from '@material-ui/core/colors';

import { Dapp } from "./components/Dapp";
// We import bootstrap here, but you can remove if you want
import "bootstrap/dist/css/bootstrap.css";

// This is the entry point of your application, but it just renders the Dapp
// react component. All of the logic is contained in it.

const theme = createMuiTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      // main: lightBlue[500],
      main: '#607d8b',
    },
    secondary: {
      // This is green.A700 as hex.
      // main: '#f45303',
      main: "#8b6e60",
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Dapp />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
