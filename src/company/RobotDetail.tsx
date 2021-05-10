import React from 'react';
import { Button, makeStyles, MenuItem, TextField, Typography } from '@material-ui/core';
import axios, { AxiosRequestConfig } from 'axios';
import { camelToSnake, fillUrl, getAuthHeaders } from '../utils';
import { DeviceDetailUrl, RobotDetailUrl } from '../constants';
import { useParams } from 'react-router-dom';
import { DefaultNamespace, TFunction } from 'react-i18next';
import { useRobot } from './hooks/useRobot';

const useStyles = makeStyles((theme) => ({
    form: {
        width: '60%',
        height: '60%',
        display: 'flex',
        flexDirection: 'column',
    },
    button: {
        marginTop: theme.spacing(3),
        marginRight: '10px',
        width: '10%'
    }
}))

export type Robot = {
    id: number,
    model: string,
    type: string,
    company: number,
    status: string
};

export type PassToServerRobot = Robot;

export type Choice = {
    value: string,
    label: string
}

export type TypeChoice = Choice;
export type StatusChoice = Choice;
export type TypeChoiceFromServer = TypeChoice;
export type StatusChoiceFromServer = StatusChoice;

export type RobotDetailParams = {
    id: string
}

export type RobotDetailProps = {
    t: TFunction<DefaultNamespace>
}

export const RobotDetail = (props: RobotDetailProps) => {
    const account = localStorage.getItem('userId') || "0"
    const { id } = useParams<RobotDetailParams>() || ""
    const { loading, robot, setRobot, typeChoices, statusChoices } = useRobot(account, id)

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name: string = event.target.name
        let value: string | number = event.target.value;
        const type: string = event.target.type
        setRobot({ ...robot, [name]: value } as Robot)
    }

    const onSave = () => {
        const accessToken = localStorage.getItem('access') || ""
        const config: AxiosRequestConfig = {
            headers: getAuthHeaders(accessToken)
        }
        if (!robot) {
            return
        }
        axios.patch(fillUrl(RobotDetailUrl, { companyPk: account, robotPk: id }), camelToSnake<Robot, PassToServerRobot>(robot), config)
            .catch((error) => alert('Fetch error\n' + error))
    }

    const classes = useStyles()
    return (
        <form className={classes.form}>
            <Typography variant='h4'>
                {props.t("robot.title")}
            </Typography>
            <TextField id="model" name="model" label={props.t("robot.model")} value={robot?.model} InputLabelProps={{ shrink: true }} onChange={onChange} />
            <TextField
                id="type"
                name="type"
                select
                label={props.t("robot.type")}
                value={robot?.type || ""}
                onChange={onChange}
                InputLabelProps={{ shrink: true }}
            >
                {typeChoices?.map((option: TypeChoice) => (
                    <MenuItem selected={option.value === robot?.type} key={option.value} value={option.value}>
                        {props.t(`robot.robotTypes.${option.label}`)}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                id="status"
                name="status"
                select
                label={props.t("robot.status")}
                value={robot?.status || ""}
                onChange={onChange}
                InputLabelProps={{ shrink: true }}
            >
                {statusChoices?.map((option: StatusChoice) => (
                    <MenuItem selected={option.value === robot?.status} key={option.value} value={option.value}>
                        {props.t(`robot.robotStatuses.${option.label}`)}
                    </MenuItem>
                ))}
            </TextField>
            <div>
                <Button className={classes.button} variant="contained" color="primary" onClick={onSave}>
                    {props.t("device.save")}
                </Button>
            </div>
        </form>
    )
}