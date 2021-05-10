import React from 'react';
import { Button, makeStyles, MenuItem, TextField, Typography } from '@material-ui/core';
import axios, { AxiosRequestConfig } from 'axios';
import { camelToSnake, fillUrl, getAuthHeaders } from '../utils';
import { DeviceDetailUrl } from '../constants';
import { useParams } from 'react-router-dom';
import { DefaultNamespace, TFunction } from 'react-i18next';
import { useDevice } from './hooks/useDevice';

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

export type Device = {
    id: number
    name: string,
    maxValue: number,
    minValue: number,
    unit: string,
    prefix: string | null
}

export type PassToServerDevice = {
    name: string,
    max_value: number,
    min_value: number,
    unit: string,
    prefix: string | null
}

export type Choice = {
    value: string,
    label: string
}

export type UnitChoice = Choice;
export type PrefixChoice = Choice;

export type UnitChoiceFromServer = UnitChoice;
export type PrefixChoiceFromServer = PrefixChoice;

export type DeviceDetailParams = {
    id: string
}

export type DeviceDetailProps = {
    t: TFunction<DefaultNamespace>
}

export const DeviceDetail = (props: DeviceDetailProps) => {
    const { id } = useParams<DeviceDetailParams>() || ""
    const { loading, device, setDevice, unitChoices, prefixChoices } = useDevice(id)

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name: string = event.target.name
        let value: string | number = event.target.value;
        const type: string = event.target.type
        if (type === "number") {
            value = Number.parseFloat(value)
        }
        setDevice({ ...device, [name]: value } as Device)
    }

    const onSave = () => {
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
        axios.patch(fillUrl(DeviceDetailUrl, { pk: id }), camelToSnake<Device, PassToServerDevice>(device), config)
            .catch((error) => alert('Fetch error\n' + error))
    }

    const classes = useStyles()
    return (
        <form className={classes.form}>
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
                <Button className={classes.button} variant="contained" color="primary" onClick={onSave}>
                    {props.t("device.save")}
                </Button>
            </div>
        </form>
    )
}