import React, { useEffect, useState } from 'react';
import { Button, makeStyles, MenuItem, TextField, Typography } from '@material-ui/core';
import axios, { AxiosRequestConfig } from 'axios';
import { camelToSnake, getAuthHeaders, snakeToCamel } from '../utils';
import { CompanyListUrl, DeviceListUrl, DevicePrefixesUrl, DeviceUnitsUrl } from '../constants';
import { Redirect } from 'react-router-dom';
import { DefaultNamespace, TFunction } from 'react-i18next';
import { Device, PassToServerDevice, PrefixChoice, PrefixChoiceFromServer, UnitChoice, UnitChoiceFromServer } from './DeviceDetail';

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

type CreateDevice = {
    name: string,
    maxValue: number,
    minValue: number,
    unit: string,
    prefix: string | null
}

type CreateDeviceFormProps = {
    t: TFunction<DefaultNamespace>
}

export const CreateDeviceForm = (props: CreateDeviceFormProps) => {
    const [createdDeviceId, setCreatedDeviceId] = useState<number>(0)
    const accessToken = localStorage.getItem('access') || ""
    const [unitChoices, setUnitChoices] = useState<UnitChoice[] | []>([])
    const [prefixChoices, setPrefixChoices] = useState<PrefixChoice[] | []>([])
    const [device, setDevice] = useState<CreateDevice>({
        name: "",
        maxValue: 0,
        minValue: 0,
        unit: "",
        prefix: null
    })

    useEffect(() => {
        const config: AxiosRequestConfig = {
            headers: getAuthHeaders(accessToken)
        }
        axios.get(DeviceUnitsUrl, config)
            .then((response) => {
                setUnitChoices(response.data.map(
                    (unitChoice: UnitChoiceFromServer) => snakeToCamel<UnitChoiceFromServer, UnitChoice>(unitChoice)
                ))
            })
            .catch((error) => alert('Fetch error\n' + error))
        axios.get(DevicePrefixesUrl, config)
            .then((response) => {
                setPrefixChoices(response.data.map(
                    (prefixChoice: PrefixChoiceFromServer) => snakeToCamel<PrefixChoiceFromServer, PrefixChoice>(prefixChoice)
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
        setDevice({ ...device, [name]: value } as Device)
    }

    const onCreate = () => {
        const accessToken = localStorage.getItem('access') || ""
        const config: AxiosRequestConfig = {
            headers: getAuthHeaders(accessToken)
        }
        if (!device) {
            return
        }
        if (!device.prefix) {
            device.prefix = null
        }
        axios.post(DeviceListUrl, camelToSnake<CreateDevice, PassToServerDevice>(device), config)
            .then((response) => { setCreatedDeviceId(response.data.id) })
            .catch((error) => alert('Fetch error\n' + error))
    }

    const classes = useStyles()
    return (
        <form className={classes.form}>
            {createdDeviceId !== 0 && <Redirect to={`/devices/${createdDeviceId}`} />}
            <Typography variant='h4'>
                {props.t("device.title")}
            </Typography>
            <TextField id="name" name="name" label={props.t("device.name")} value={device?.name} InputLabelProps={{ shrink: true }} onChange={onChange} />
            <TextField id="minValue" name="minValue" type="number" label={props.t("device.minValue")} value={device?.minValue} InputLabelProps={{ shrink: true }} onChange={onChange} />
            <TextField id="maxValue" name="maxValue" type="number" label={props.t("device.maxValue")} value={device?.maxValue} InputLabelProps={{ shrink: true }} onChange={onChange} />
            <TextField
                id="unit"
                name="unit"
                select
                label={props.t("device.unit")}
                value={device?.unit || ""}
                onChange={onChange}
                InputLabelProps={{ shrink: true }}
            >
                {unitChoices?.map((option: UnitChoice) => (
                    <MenuItem selected={option.value === device?.unit} key={option.value} value={option.value}>
                        {props.t(`device.deviceUnits.${option.label}`)}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                id="prefix"
                name="prefix"
                select
                label={props.t("device.prefix")}
                value={device?.prefix || ""}
                onChange={onChange}
                InputLabelProps={{ shrink: true }}
            >
                <MenuItem selected={null === device?.unit} key="noPrefix" value="">
                    {props.t(`device.devicePrefixes.noPrefix`)}
                </MenuItem>
                {prefixChoices?.map((option: PrefixChoice) => (
                    <MenuItem selected={option.value === device?.unit} key={option.value} value={option.value}>
                        {props.t(`device.devicePrefixes.${option.label}`)}
                    </MenuItem>
                ))}
            </TextField>
            <div>
                <Button className={classes.button} variant="contained" color="primary" onClick={onCreate}>
                    {props.t("device.create")}
                </Button>
            </div>
        </form>
    )
}