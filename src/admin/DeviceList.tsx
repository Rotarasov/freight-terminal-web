import { Button, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import axios, { AxiosRequestConfig } from 'axios';
import React from 'react';
import { DefaultNamespace, TFunction } from 'react-i18next';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import { DeviceDetailUrl } from '../constants';
import { fillUrl, getAuthHeaders } from '../utils';
import { CreateDeviceForm } from './CreateDevice';
import { Device, DeviceDetail } from './DeviceDetail';
import { useDevices } from './hooks/useDevices';

const useStyles = makeStyles((theme) => ({
    tableContainer: {
        width: '80%',
        height: '80%',
    },
    addButton: {
        width: '45%'
    },
    button: {
        marginRight: '10px',
        width: '20%'
    },
    lastButton: {
        width: '20%'
    }
}))

type DeviceListProps = {
    t: TFunction<DefaultNamespace>
}

export const DeviceList = (props: DeviceListProps) => {
    const { path, url } = useRouteMatch()
    const { loading, devices, unitChoices, prefixChoices } = useDevices()
    const classes = useStyles()

    const onDelete = (event: React.MouseEvent<HTMLElement>) => {
        const target = event.currentTarget
        const id: string | null = target.getAttribute('id')
        if (!id) {
            return
        }
        const accessToken = localStorage.getItem('access') || ""
        const config: AxiosRequestConfig = {
            headers: getAuthHeaders(accessToken)
        }
        axios.delete(fillUrl(DeviceDetailUrl, { pk: id }), config)
            .catch((error) => alert('Fetch error\n' + error))

        window.location.reload()
    }

    return (
        <Switch>
            <Route path={`${path}/create-device`}>
                <CreateDeviceForm t={props.t} />
            </Route>
            <Route path={`${path}/:id`}>
                <DeviceDetail t={props.t} />
            </Route>
            <Route path={path}>
                <div className={classes.tableContainer}>
                    <Typography variant='h4'>
                        {props.t("devices.title")}
                    </Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell align="right">
                                    <Button component={Link} to={`${url}/create-device`} className={classes.addButton} variant="contained" color="primary">
                                        {props.t("devices.create")}
                                    </Button>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>{props.t("devices.device")}</TableCell>
                                <TableCell align="right">{props.t("devices.action")}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {devices.map((device: Device) => (
                                <TableRow key={device.id.toString()}>
                                    <TableCell component="th" scope="row">
                                        {device.name}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button component={Link} to={`${url}/${device.id}`} className={classes.button} variant="contained" color="default">
                                            {props.t("devices.detail")}
                                        </Button>
                                        <Button id={device.id.toString()} className={classes.lastButton} variant="contained" color="secondary" onClick={onDelete}>
                                            {props.t("devices.delete")}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Route>
        </Switch>
    )
}