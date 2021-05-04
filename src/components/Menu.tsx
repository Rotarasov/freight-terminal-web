import React from "react";
import { Divider, Drawer, List, ListItem, ListItemText, makeStyles, Toolbar } from "@material-ui/core";
import axios, { AxiosRequestConfig } from "axios";
import { BackupDBUrl, RestoreDBUrl } from "../constants";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";

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

const onBackupDB = () => {
    const accessToken = localStorage.getItem('access') || ""
    const config: AxiosRequestConfig = {
        headers: {
            Authorization: "Bearer " + accessToken
        }
    }
    axios.post(BackupDBUrl, undefined, config)
        .then(() => alert("Backup has been created."))
        .catch((error) => alert('Fetch error\n' + error))
}

const onRestoreDB = () => {
    const accessToken = localStorage.getItem('access') || ""
    const config: AxiosRequestConfig = {
        headers: {
            Authorization: "Bearer " + accessToken
        }
    }
    axios.post(RestoreDBUrl, undefined, config)
        .then(() => alert("Backup has been restored."))
        .catch((error) => alert('Fetch error\n' + error))
}

const onLogout = (setIsLoggedIn: (isLoggedIn: boolean) => void) => {
    localStorage.removeItem('userId')
    localStorage.removeItem('access')
    localStorage.removeItem('isAdmin')
    setIsLoggedIn(false)
}

const onSSLCertificateUpdate = () => {
    const date = new Date()
    date.setMonth(date.getMonth() + 6)
    alert("SSl certificate has been updated. Expire date: " + date.toString())
}

const NotLoggedInMenuList = () => {
    return (
        <List></List>
    )
}

const AdminMenuList = (props: MenuProps) => {
    return (
        <List>
            <ListItem button component={Link} to="/info" key='My Info'>
                <ListItemText primary='My Info' />
            </ListItem>
            <ListItem button component={Link} to="/companies" key='Companies'>
                <ListItemText primary='Companies' />
            </ListItem>
            <Divider />
            <ListItem button key='Backup' onClick={onBackupDB}>
                <ListItemText primary='Backup' />
            </ListItem>
            <ListItem button key='Restore' onClick={onRestoreDB}>
                <ListItemText primary='Restore' />
            </ListItem>
            <ListItem button key='Update SSL' onClick={onSSLCertificateUpdate}>
                <ListItemText primary='Update SSL' />
            </ListItem>
            <ListItem button key='Logout' onClick={() => onLogout(props.setIsLoggedIn)}>
                <ListItemText primary='Logout' />
            </ListItem>
        </List>
    )
}

const CompanyMenuList = (props: MenuProps) => {
    return (
        <List>
            <ListItem button key='My Info'>
                <ListItemText primary='My Info' />
            </ListItem>
            <ListItem button key='Company Info'>
                <ListItemText primary='Company Info' />
            </ListItem>
            <Divider />
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
            <Divider />
            <ListItem button key='Logout' onClick={() => onLogout(props.setIsLoggedIn)}>
                <ListItemText primary='Logout' />
            </ListItem>
        </List>
    )
}

type MenuProps = {
    isLoggedIn: boolean
    setIsLoggedIn: (isLoggedIn: boolean) => void
}

export const Menu = (props: MenuProps) => {
    const isAdmin: boolean = Boolean(localStorage.getItem('isAdmin'))
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
                {props.isLoggedIn && isAdmin && <AdminMenuList isLoggedIn={props.isLoggedIn} setIsLoggedIn={props.setIsLoggedIn} />}
                {/* {props.isLoggedIn && !isAdmin && <CompanyMenuList isLoggedIn={props.isLoggedIn} setIsLoggedIn={props.setIsLoggedIn} />} */}
                {!props.isLoggedIn && <NotLoggedInMenuList /> && <Redirect to="/" />}
            </div>
        </Drawer>
    )
}