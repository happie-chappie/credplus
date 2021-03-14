import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      marginTop: theme.spacing(2),
      width: theme.spacing(16),
      height: theme.spacing(16),
    },
    justifyContent: 'center',
    // alignItems: 'center',
  },
  paper: {
    width: 600,
    height: 800,
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  }
}));

export default function Variants({state, poolAction}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper
	className={classes.paper}
	variant="outlined"
	elevation={3}
      >
	<Typography>
	  This is for testing purpose
	</Typography>
	<Typography>
	  Below is the entire state of the components and features of the protocol
	</Typography>
	<Divider />
	<Typography> Wallet Address </Typography>
	<Typography>  {state.selectedAddress} </Typography>
	<Divider />
	    {state.tokenData && state.poolData && state.walletData && (
	      <div>
		<Typography>
		  Governance Token Balance: {state.balance.toString()} {state.tokenData.symbol}
		</Typography>
		<Divider />
		<div>
		<Typography>
		    Pool DAI BALANCE: {state.poolData.daiBalance.toString()}
		</Typography>
		<Typography>
		    Pool CToken BALANCE: {state.poolData.ctokenBalance.toString()}
		</Typography>
	      </div>
		<Divider />
		<div>
		<Typography>
		    Wallet DAI BALANCE: {state.walletData.daiBalance.toString()}
		</Typography>
		<Typography>
		    Wallet CToken BALANCE: {state.walletData.ctokenBalance.toString()}
		</Typography>
	      </div>
		<Divider />
		<Button
		  // variant="contained"
		  color="inherit"
		  style={{ border: "1px solid #f45303",justify: "flex-end", margin: 20}}
		  onClick={() => poolAction('approveDAI', 1000)}
		>Approve 1k DAI Transfer</Button>
		<Divider />
		<Button
		  // variant="contained"
		  color="inherit"
		  style={{ border: "1px solid #f45303",justify: "flex-end", margin: 20}}
		  onClick={() => poolAction('approveCToken', 1000)}
		>Approve 1k CToken Transfer</Button>
		<Divider />
		<Button
		  // variant="contained"
		  color="inherit"
		  style={{ border: "1px solid #f45303",justify: "flex-end", margin: 20}}
		  onClick={() => poolAction('borrow', 1000)}
		>Borrow 1k DAI</Button>
		<Divider />
		<Button
		  // variant="contained"
		  color="inherit"
		  style={{ border: "1px solid #f45303",justify: "flex-end", margin: 20}}
		  onClick={() => poolAction('deposit', 1000)}
		>Deposit 1k DAI</Button>
		<Divider />
		<Button
		  // variant="contained"
		  color="inherit"
		  style={{ border: "1px solid #f45303",justify: "flex-end", margin: 20}}
		  onClick={() => poolAction('withdraw', 1000)}
		>Withdraw 1k DAI</Button>
		<Divider />
		<Button
		  // variant="contained"
		  color="inherit"
		  style={{ border: "1px solid #f45303",justify: "flex-end", margin: 20}}
		  onClick={() => poolAction('repay', 1000)}
		>Repay 1k DAI</Button>
	      </div>
	    )}
      </Paper>
    </div>
  );
}
