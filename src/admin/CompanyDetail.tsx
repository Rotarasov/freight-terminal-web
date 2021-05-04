import React from 'react';
import { Button, makeStyles, MenuItem, TextField, Typography } from '@material-ui/core';
import { useCompany } from './hooks/useCompany';
import axios, { AxiosRequestConfig } from 'axios';
import { fillUrl, getAuthHeaders } from '../utils';
import { CompanyDetailUrl } from '../constants';
import { useParams } from 'react-router-dom';

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

export type Company = {
    account: number
    name: string,
    type: string
}

export type PassToServerCompany = Company

export type TypeChoice = {
    value: string,
    label: string
}

export type PassToServerTypeChoice = TypeChoice

export type CompanyDetailParams = {
    id: string
}

export const CompanyDetail = () => {
    const { id } = useParams<CompanyDetailParams>() || ""
    const { loading, company, setCompany, typeChoices } = useCompany(id)

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name: string = event.target.name
        const value: string = event.target.value;
        setCompany({ ...company, [name]: value } as Company)
    }

    const onSave = () => {
        const accessToken = localStorage.getItem('access') || ""
        const config: AxiosRequestConfig = {
            headers: getAuthHeaders(accessToken)
        }
        axios.patch(fillUrl(CompanyDetailUrl, { pk: id }), company, config)
            .catch((error) => alert('Fetch error\n' + error))
    }

    const classes = useStyles()
    return (
        <form className={classes.form}>
            <Typography variant='h4'>
                Company
            </Typography>
            <TextField id="name" name="name" label="Name" value={company?.name} InputLabelProps={{ shrink: true }} onChange={onChange} />
            <TextField
                id="type"
                name="type"
                select
                label="Type"
                value={typeChoices && typeChoices.find((typeChoice: TypeChoice) => typeChoice.value === company?.type)?.value}
                onChange={onChange}
            >
                {typeChoices?.map((option: TypeChoice) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
            <div>
                <Button className={classes.button} variant="contained" color="primary" onClick={onSave}>
                    Save
                </Button>
            </div>
        </form>
    )
}