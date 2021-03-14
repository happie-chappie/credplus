import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      marginTop: theme.spacing(10),
      width: theme.spacing(16),
      height: theme.spacing(16),
    },
    justifyContent: 'center',
    // alignItems: 'center',
  },
  paper: {
    width: 600,
    height: 200,
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  }
}));

export default function Variants({state}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper
	className={classes.paper}
	variant="outlined"
	elevation={3}
      >
	<Typography>  Lend </Typography>
      </Paper>
    </div>
  );
}
