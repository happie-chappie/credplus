import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      marginTop: theme.spacing(4),
      // width: theme.spacing(16),
      // height: theme.spacing(16),
    },
    justifyContent: 'center',
    // alignItems: 'center',
  },
  paper: {
    width: 600,
    // height: 700,
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  table: {
    maxWidth: 600,
    // height: 200,
  },
}));

export default function Variants({state}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper
	className={classes.paper}
	// variant="outlined"
	elevation={0}
      >
	<Typography variant="h4">  March 2020 Pool </Typography>
	<Divider />
	<TableContainer component={Paper}>
	  <Table className={classes.table} aria-label="simple table">
	    <TableHead>
	      <TableRow>
		<TableCell>Token</TableCell>
		<TableCell align="right">Pool Size</TableCell>
	      </TableRow>
	    </TableHead>
	    {state.tokenData && state.poolData && state.walletData && (
	    <TableBody>
	      <TableRow key="1">
		<TableCell component="th" scope="row">
		  DAI
		</TableCell>
		<TableCell align="right">{state.poolData.daiBalance.toString()}</TableCell>
	      </TableRow>
	      <TableRow key="3">
		<TableCell component="th" scope="row">
		  CToken
		</TableCell>
		<TableCell align="right">{state.poolData.ctokenBalance.toString()}</TableCell>
	      </TableRow>
	    </TableBody>)}
	  </Table>
	</TableContainer>
	<div style={{height: 60}} />
	<Typography variant="h4">  Your Wallet </Typography>
	<Divider />
	<TableContainer component={Paper}>
	  <Table className={classes.table} aria-label="simple table">
	    <TableHead>
	      <TableRow>
		<TableCell>Token</TableCell>
		<TableCell align="right">Balance</TableCell>
	      </TableRow>
	    </TableHead>
	    {state.tokenData && state.poolData && state.walletData && (
	    <TableBody>
	      <TableRow key="1">
		<TableCell component="th" scope="row">
		  DAI
		</TableCell>
		<TableCell align="right">{state.walletData.daiBalance.toString()}</TableCell>
	      </TableRow>
	      <TableRow key="3">
		<TableCell component="th" scope="row">
		  CToken
		</TableCell>
		<TableCell align="right">{state.walletData.ctokenBalance.toString()}</TableCell>
	      </TableRow>
	    </TableBody>)}
	  </Table>
	</TableContainer>
      </Paper>
    </div>
  );
}
