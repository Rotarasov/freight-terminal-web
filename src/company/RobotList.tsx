import { Button, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import axios, { AxiosRequestConfig } from 'axios';
import React from 'react';
import { DefaultNamespace, TFunction } from 'react-i18next';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import { RobotDetailUrl } from '../constants';
import { fillUrl, getAuthHeaders } from '../utils';
import { CreateRobotForm } from './CreateRobot';
import { useRobots } from './hooks/useRobots'
import { Robot, RobotDetail, StatusChoice, TypeChoice } from './RobotDetail';

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

type RobotListProps = {
    t: TFunction<DefaultNamespace>
}

export const RobotList = (props: RobotListProps) => {
    const account = localStorage.getItem('userId') || "0"
    const { path, url } = useRouteMatch()
    const { loading, robots, typeChoices, statusChoices } = useRobots()
    const classes = useStyles()

    const onDelete = (event: React.MouseEvent<HTMLElement>) => {
        const target = event.currentTarget
        const id: string | null = target.getAttribute('id')
        console.log(id)
        if (!id) {
            return
        }
        const accessToken = localStorage.getItem('access') || ""
        const config: AxiosRequestConfig = {
            headers: getAuthHeaders(accessToken)
        }
        axios.delete(fillUrl(RobotDetailUrl, { companyPk: account, robotPk: id }), config)
            .catch((error) => alert('Fetch error\n' + error))
            .finally(() => window.location.reload())
    }

    return (
        <Switch>
            <Route path={`${path}/create-robot`}>
                <CreateRobotForm t={props.t} />
            </Route>
            <Route path={`${path}/:id`}>
                <RobotDetail t={props.t} />
            </Route>
            <Route path={path}>
                <div className={classes.tableContainer}>
                    <Typography variant='h4'>
                        {props.t("robots.title")}
                    </Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell align="right">
                                    <Button component={Link} to={`${url}/create-robot`} className={classes.addButton} variant="contained" color="primary">
                                        {props.t("robots.create")}
                                    </Button>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>{props.t("robots.model")}</TableCell>
                                <TableCell>{props.t("robots.type")}</TableCell>
                                <TableCell>{props.t("robots.status")}</TableCell>
                                <TableCell align="right">{props.t("robots.action")}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {robots.map((robot: Robot) => (
                                <TableRow key={robot.id.toString()}>
                                    <TableCell component="th" scope="row">
                                        {robot.model}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {props.t("robot.robotTypes." +
                                            typeChoices.find((typeChoice: TypeChoice) => typeChoice.value === robot.type)?.label)}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {props.t("robot.robotStatuses." +
                                            statusChoices.find((statusChoice: StatusChoice) => statusChoice.value === robot.status)?.label)}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button component={Link} to={`${url}/${robot.id}`} className={classes.button} variant="contained" color="default">
                                            {props.t("robots.detail")}
                                        </Button>
                                        <Button id={robot.id.toString()} className={classes.lastButton} variant="contained" color="secondary" onClick={onDelete}>
                                            {props.t("robots.delete")}
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