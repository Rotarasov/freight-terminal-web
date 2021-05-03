import React from "react";
import { Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, makeStyles, Toolbar } from "@material-ui/core";

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerContainer: {
        overflow: 'auto',
    },
}))


const AdminMenuList = () => {
    return (
        <List>
            <ListItem button key='My Info'>
                <ListItemText primary='My Info' />
            </ListItem>
            <ListItem button key='Companies'>
                <ListItemText primary='Companies' />
            </ListItem>
            <Divider />
            <ListItem button key='Backup'>
                <ListItemText primary='Backup' />
            </ListItem>
            <ListItem button key='Restore'>
                <ListItemText primary='Restore' />
            </ListItem>
            <ListItem button key='Update SSL'>
                <ListItemText primary='Update SSL' />
            </ListItem>
        </List>
    )
}

const CompanyMenuList = () => {
    return (
        <List>
            <ListItem button key='My Info'>
                <ListItemText primary='My Info' />
            </ListItem>
            <ListItem button key='Company Info'>
                <ListItemText primary='Company Info' />
            </ListItem>
            <ListItem button key='Robots'>
                <ListItemText primary='Robots' />
            </ListItem>
            <ListItem button key='Services'>
                <ListItemText primary='Services' />
            </ListItem>
            <ListItem button key='Freights'>
                <ListItemText primary='Freights' />
            </ListItem>
            <ListItem button key='Devices'>
                <ListItemText primary='Devices' />
            </ListItem>
        </List>
    )
}

export type MenuProps = {
    isAdmin: boolean,
}

export const Menu = ({ isAdmin }: MenuProps) => {
    const classes = useStyles()
    return (
        <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
                paper: classes.drawerPaper,
            }}>
            <Toolbar />
            <div className={classes.drawerContainer}>
                {isAdmin ? <AdminMenuList /> : <CompanyMenuList />}
            </div>
        </Drawer>
    )
}