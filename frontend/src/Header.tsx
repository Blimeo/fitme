import React from 'react'
import { AppBar, Tabs, Tab, Button, Toolbar, Typography, makeStyles, createStyles, Theme } from '@material-ui/core'
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import './css/Header.css';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        expand: {
            flexGrow: 1,
        },
    }),
);

function Nav() {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">
                        Fitme
                    </Typography>
                    <Tabs className={classes.expand}>
                    <Link to="/"><Tab label="Home" /></Link>
                    <Link to="/about"><Tab label="About" /></Link>
                    <Link to="/items"><Tab label="Items" /></Link>
                    <Link to="/fits"><Tab label="Fits" /></Link>
                    </Tabs>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
        </div>
    )

}

export default Nav;