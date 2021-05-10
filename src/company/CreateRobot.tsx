import React, { useEffect, useState } from 'react';
import { Button, makeStyles, MenuItem, TextField, Typography } from '@material-ui/core';
import axios, { AxiosRequestConfig } from 'axios';
import { camelToSnake, fillUrl, getAuthHeaders, snakeToCamel } from '../utils';
import { DeviceListUrl, RobotListUrl, RobotStatusesUrl, RobotTypesUrl } from '../constants';
import { Redirect, useParams } from 'react-router-dom';
import { DefaultNamespace, TFunction } from 'react-i18next';
import { TypeChoice, StatusChoice, Robot, StatusChoiceFromServer, TypeChoiceFromServer, PassToServerRobot } from './RobotDetail';

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
        width: '20%'
    }
}))

type CreateRobot = {
    model: string,
    type: string,
    company: number,
    status: string
}

type CreateRobotFormProps = {
    t: TFunction<DefaultNamespace>
}

export const CreateRobotForm = (props: CreateRobotFormProps) => {
    const account = localStorage.getItem('userId') || "0"
    const [createdRobotId, setCreatedRobotId] = useState<number>(0)
    const accessToken = localStorage.getItem('access') || ""
    const [typeChoices, setTypeChoices] = useState<TypeChoice[] | []>([])
    const [statusChoices, setStatusChoices] = useState<StatusChoice[] | []>([])
    const [robot, setRobot] = useState<CreateRobot>({
        model: "",
        type: "",
        company: Number.parseInt(account),
        status: ""
    })

    useEffect(() => {
        const config: AxiosRequestConfig = {
            headers: getAuthHeaders(accessToken)
        }
        axios.get(RobotTypesUrl, config)
            .then((response) => {
                setTypeChoices(response.data.map(
                    (typeChoice: TypeChoiceFromServer) => snakeToCamel<TypeChoiceFromServer, TypeChoice>(typeChoice)
                ))
            })
            .catch((error) => alert('Fetch error\n' + error))
        axios.get(RobotStatusesUrl, config)
            .then((response) => {
                setStatusChoices(response.data.map(
                    (statusChoice: StatusChoiceFromServer) => snakeToCamel<StatusChoiceFromServer, TypeChoice>(statusChoice)
                ))
            })
            .catch((error) => alert('Fetch error\n' + error))
    }, [])

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name: string = event.target.name
        let value: string | number = event.target.value;
        const type: string = event.target.type
        if (type === "number") {
            value = Number.parseFloat(value)
        }
        setRobot({ ...robot, [name]: value } as CreateRobot)
    }

    const onCreate = () => {
        const accessToken = localStorage.getItem('access') || ""
        const config: AxiosRequestConfig = {
            headers: getAuthHeaders(accessToken)
        }
        if (!robot) {
            return
        }
        axios.post(fillUrl(RobotListUrl, { pk: account }), camelToSnake<CreateRobot, PassToServerRobot>(robot), config)
            .then((response) => { setCreatedRobotId(response.data.id) })
            .catch((error) => alert('Fetch error\n' + error))
    }

    const classes = useStyles()
    return (
        <form className={classes.form}>
            {createdRobotId !== 0 && <Redirect to={`/robots/${createdRobotId}`} />}
            <Typography variant='h4'>
                {props.t("robot.titleForCreate")}
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
                        {props.t(`robot.robotTypesLabels.${option.label}`)}
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
                        {props.t(`robot.robotStatusesLabels.${option.label}`)}
                    </MenuItem>
                ))}
            </TextField>
            <div>
                <Button className={classes.button} variant="contained" color="primary" onClick={onCreate}>
                    {props.t("robot.create")}
                </Button>
            </div>
        </form>
    )
}