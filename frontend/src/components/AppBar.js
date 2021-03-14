import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
// import IconButton from '@material-ui/core/IconButton';
// import Toolbar from '@material-ui/core/Toolbar';
// import MenuIcon from '@material-ui/icons/Menu';

import WalletDetails from "./WalletDetails";
import Borrow from "./Borrow";
import Lend from "./Lend";
import All from "./All";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function TabPanel(props) {
  const { children, value, index, state, poolAction, ...other } = props;

  if (index === 0) {
    return (
      <div
	role="tabpanel"
	hidden={value !== index}
	id={`simple-tabpanel-${index}`}
	aria-labelledby={`simple-tab-${index}`}
	{...other}
      >
	<All state={state} poolAction={poolAction} />
      </div>
    );
  }

  if (index === 1) {
    return (
      <div
	role="tabpanel"
	hidden={value !== index}
	id={`simple-tabpanel-${index}`}
	aria-labelledby={`simple-tab-${index}`}
	{...other}
      >
	<Borrow state={state}/>
      </div>
    );
  }

  if (index === 2) {
    return (
      <div
	role="tabpanel"
	hidden={value !== index}
	id={`simple-tabpanel-${index}`}
	aria-labelledby={`simple-tab-${index}`}
	{...other}
      >
	<Lend state={state}/>
      </div>
    );
  }

  if (index === 3) {
    return (
      <div
	role="tabpanel"
	hidden={value !== index}
	id={`simple-tabpanel-${index}`}
	aria-labelledby={`simple-tab-${index}`}
	{...other}
      >
	<WalletDetails state={state}/>
      </div>
    );
  }
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


export default function ButtonAppBar({
  state,
  connectWallet,
  networkError,
  dismiss,
  poolAction,
}) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // console.log("=========");
  // console.log(state);

  return (
    <div className={classes.root}>
      <AppBar position="static" style={{display: "flex", fontSize: 48, flexDirection: "row", height: 80, justifyContent: "space-between" }}>
	<Tabs value={value} onChange={handleChange} aria-label="simple tabs example" style={{fontSize: 48, height: 80}} >
	  <Tab label="Pool" {...a11yProps(0)} style={{height: 80}} />
	  <Tab label="Borrow" {...a11yProps(1)} />
	  <Tab label="Lend" {...a11yProps(2)} />
	  <Tab label="Wallet" {...a11yProps(3)} />
	</Tabs>
	<Button
	  // variant="contained"
	  color="inherit"
	  style={{ border: "1px solid #f45303",justify: "flex-end", margin: 20}}
	  onClick={connectWallet}
	>Connect Wallet</Button>
      </AppBar>
      <TabPanel value={value} index={0} state={state} poolAction={poolAction}>
      </TabPanel>
      <TabPanel value={value} index={1} state={state}>
      </TabPanel>
      <TabPanel value={value} index={2} state={state}>
      </TabPanel>
      <TabPanel value={value} index={3} state={state}>
      </TabPanel>
    </div>
  );
}
