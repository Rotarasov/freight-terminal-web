import React from "react";
import { Divider, Drawer, List, ListItem, ListItemText, makeStyles, MenuItem, Select, TextField, Toolbar } from "@material-ui/core";
import axios, { AxiosRequestConfig } from "axios";
import { BackupDBUrl, RestoreDBUrl } from "../constants";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import { DefaultNamespace, TFunction } from "react-i18next";
import { i18n } from "i18next";

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

const onBackupDB = (t: TFunction<DefaultNamespace>) => {
    const accessToken = localStorage.getItem('access') || ""
    const config: AxiosRequestConfig = {
        headers: {
            Authorization: "Bearer " + accessToken
        }
    }
    axios.post(BackupDBUrl, undefined, config)
        .then(() => alert(t("menu.backupAlert")))
        .catch((error) => alert('Fetch error\n' + error))
}

const onRestoreDB = (t: TFunction<DefaultNamespace>) => {
    const accessToken = localStorage.getItem('access') || ""
    const config: AxiosRequestConfig = {
        headers: {
            Authorization: "Bearer " + accessToken
        }
    }
    axios.post(RestoreDBUrl, undefined, config)
        .then(() => alert(t("menu.restoreAlert")))
        .catch((error) => alert('Fetch error\n' + error))
}

const onLogout = (setIsLoggedIn: (isLoggedIn: boolean) => void) => {
    localStorage.removeItem('userId')
    localStorage.removeItem('access')
    localStorage.removeItem('isAdmin')
    setIsLoggedIn(false)
}

const onSSLCertificateUpdate = (t: TFunction<DefaultNamespace>) => {
    const date = new Date()
    date.setMonth(date.getMonth() + 6)
    alert(t("menu.updateSSL") + date.toString())
}

const languages: Record<string, string> = {
    en: "English",
    uk: "Ukrainian"
}

const NotLoggedInMenuList = (props: MenuProps) => {
    return (
        <List>
            <ListItem button key='Language'>
                <Select
                    style={{ width: 300 }}
                    value={props.i18n.language}
                    onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                        props.i18n.changeLanguage(event.target.value as string)
                    }}
                >
                    {Object.keys(languages).map((key: string) => (
                        <MenuItem value={key}>{props.t("menu." + languages[key].toLowerCase())}</MenuItem>
                    ))}
                </Select>
            </ListItem>
        </List>
    )
}

const AdminMenuList = (props: MenuProps) => {
    return (
        <List>
            <ListItem button component={Link} to="/info" key='My Info'>
                <ListItemText primary={props.t('menu.myInfo')} />
            </ListItem>
            <ListItem button component={Link} to="/companies" key='Companies'>
                <ListItemText primary={props.t('menu.companies')} />
            </ListItem>
            <ListItem button component={Link} to="/devices" key='Devices'>
                <ListItemText primary={props.t('menu.devices')} />
            </ListItem>
            <Divider />
            <ListItem button key='Backup' onClick={() => onBackupDB(props.t)}>
                <ListItemText primary={props.t('menu.backup')} />
            </ListItem>
            <ListItem button key='Restore' onClick={() => onRestoreDB(props.t)}>
                <ListItemText primary={props.t('menu.restore')} />
            </ListItem>
            <ListItem button key='Update SSL' onClick={() => onSSLCertificateUpdate(props.t)}>
                <ListItemText primary={props.t('menu.updateSSL')} />
            </ListItem>
            <Divider />
            <ListItem button key='Language'>
                <Select
                    style={{ width: 300 }}
                    value={props.i18n.language}
                    onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                        props.i18n.changeLanguage(event.target.value as string)
                    }}
                >
                    {Object.keys(languages).map((key: string) => (
                        <MenuItem value={key}>{props.t("menu." + languages[key].toLowerCase())}</MenuItem>
                    ))}
                </Select>
            </ListItem>
            <ListItem button key='Logout' onClick={() => onLogout(props.setIsLoggedIn)}>
                <ListItemText primary={props.t('menu.logout')} />
            </ListItem>
        </List >
    )
}

const CompanyMenuList = (props: MenuProps) => {
    const account = localStorage.getItem('userId')
    return (
        <List>
            <ListItem button component={Link} to="/info" key='My Info'>
                <ListItemText primary={props.t('menu.myInfo')} />
            </ListItem>
            <ListItem button component={Link} to={`/companies/${account}`} key='Company Info'>
                <ListItemText primary={props.t('menu.companyInfo')} />
            </ListItem>
            <Divider />
            <ListItem button component={Link} to="/robots" key='Robots'>
                <ListItemText primary={props.t('menu.robots')} />
            </ListItem>
            <ListItem button component={Link} to="/services" key='Services'>
                <ListItemText primary={props.t('menu.services')} />
            </ListItem>
            {/* <ListItem button key='Freights'>
                <ListItemText primary={props.t('menu.freights')} />
            </ListItem> */}
            <Divider />
            <ListItem button key='Language'>
                <Select
                    style={{ width: 300 }}
                    value={props.i18n.language}
                    onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                        props.i18n.changeLanguage(event.target.value as string)
                    }}
                >
                    {Object.keys(languages).map((key: string) => (
                        <MenuItem value={key}>{props.t("menu." + languages[key].toLowerCase())}</MenuItem>
                    ))}
                </Select>
            </ListItem>
            <ListItem button key='Logout' onClick={() => onLogout(props.setIsLoggedIn)}>
                <ListItemText primary={props.t('menu.logout')} />
            </ListItem>
        </List>
    )
}

type MenuProps = {
    isLoggedIn: boolean
    setIsLoggedIn: (isLoggedIn: boolean) => void
    t: TFunction<DefaultNamespace>,
    i18n: i18n
}

export const Menu = (props: MenuProps) => {
    const isAdmin: boolean = localStorage.getItem('isAdmin') === "true"
    const classes = useStyles()
    console.log(props.isLoggedIn, isAdmin)
    return (
        <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
                paper: classes.drawerPaper,
            }}>
            <Toolbar />
            <div className={classes.drawerContainer}>
                {props.isLoggedIn && isAdmin && <AdminMenuList isLoggedIn={props.isLoggedIn} setIsLoggedIn={props.setIsLoggedIn} t={props.t} i18n={props.i18n} />}
                {props.isLoggedIn && !isAdmin && <CompanyMenuList isLoggedIn={props.isLoggedIn} setIsLoggedIn={props.setIsLoggedIn} t={props.t} i18n={props.i18n} />}
                {!props.isLoggedIn && < NotLoggedInMenuList isLoggedIn={props.isLoggedIn} setIsLoggedIn={props.setIsLoggedIn} t={props.t} i18n={props.i18n} />}
                {!props.isLoggedIn && <Redirect to="/" />}
            </div>
        </Drawer>
    )
}