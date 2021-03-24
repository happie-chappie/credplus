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
		<TableCell align="left">Borrowed DAI</TableCell>
		<TableCell align="left">Time</TableCell>
		<TableCell align="right">Repay</TableCell>
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
	    </TableBody>)}
	  </Table>
	</TableContainer>
      </Paper>
    </div>
  );
}
