import React, { useRef } from 'react';
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
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Box from '@material-ui/core/Box';

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

export default function Variants({state, poolAction}) {
  const classes = useStyles();
  const inputRef = useRef();

  const handleBorrow = () => {
    // console.log(inputRef.current.value);
    poolAction("borrow", inputRef.current.value);
    // inputRef.current.value = null;
  }
  // console.log("=========");
  let transactions = [];
  if(state.transactionsData) {
    transactions = state.transactionsData.balanceTransactions;
  }

  const renderTableBody = () => {
    /*
    transactions.forEach(tx => {
      console.log("=========");
      console.log(tx.length);
      console.log(tx.amount.toString());
      console.log(tx[0]);
      console.log(tx[1]);
      console.log(tx[2]);
    })
    */

    const rows = transactions.map(transaction => (
      <TableRow key={transaction.borrowedTime}>
	<TableCell component="th" scope="row">
	  {transaction.id.toString()}
	</TableCell>
	<TableCell align="right">{transaction.amount.toString()}</TableCell>
	<TableCell align="right">{transaction.borrowedTime.toString()}</TableCell>
      </TableRow>
    ))

    return <TableBody>{rows}</TableBody>;
  }

  return (
    <div className={classes.root}>
      <Paper
	className={classes.paper}
	// variant="outlined"
	elevation={0}
      >
	<Typography variant="h4"> BORROW  </Typography>
	<Divider />
	<div style={{height: 20}} />
	    {state.tokenData && state.poolData && state.walletData && (
	      <Box display="flex" flexDirection="column">
		<TextField
		  id="outlined-basic"
		  label="To Borrow"
		  variant="outlined"
		  type="number"
		  inputRef={inputRef}
		/>
		<div style={{height: 20}} />
		<Box display="flex" justifyContent="center">
		  <ButtonGroup color="primary" aria-label="outlined primary button group">
		    <Button onClick={handleBorrow}>Borrow</Button>
		  </ButtonGroup>
		</Box>
	      </Box>
	    )}
	<div style={{height: 60}} />
	<Typography variant="h4"> Previous Borrow Transactions </Typography>
	<Divider />
	<TableContainer component={Paper}>
	  <Table className={classes.table} aria-label="simple table">
	    <TableHead>
	      <TableRow>
		<TableCell align="left">ID</TableCell>
		<TableCell align="right">Borrowed DAI</TableCell>
		<TableCell align="right">Borrowed Time</TableCell>
		<TableCell align="right">Repayed Time</TableCell>
		<TableCell align="right"></TableCell>
	      </TableRow>
	    </TableHead>
	    {state.tokenData && state.poolData && state.walletData && state.transactionsData && (
	      <>{renderTableBody()}</>)}
	  </Table>
	</TableContainer>
      </Paper>
    </div>
  );
}
