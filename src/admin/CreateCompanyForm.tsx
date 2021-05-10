import React, { useEffect, useState } from 'react';
import { PassToServerTypeChoice, TypeChoice } from './CompanyDetail';
import { Button, makeStyles, MenuItem, TextField, Typography } from '@material-ui/core';
import axios, { AxiosRequestConfig } from 'axios';
import { getAuthHeaders, snakeToCamel } from '../utils';
import { CompanyListUrl, CompanyTypesUrl } from '../constants';
import { Redirect, useParams } from 'react-router-dom';
import { DefaultNamespace, TFunction } from 'react-i18next';

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

export type CreateCompany = {
    account: number
    name: string,
    type: string
}

export type CreateCompanyParams = {
    id?: string
}

type CreateCompanyFormProps = {
    t: TFunction<DefaultNamespace>
}

export const CreateCompanyForm = (props: CreateCompanyFormProps) => {
    const { id } = useParams<CreateCompanyParams>()
    const [createdCompanyId, setCreatedCompanyId] = useState<number>(0)
    const accessToken = localStorage.getItem('access') || ""
    const [typeChoices, setTypeChoices] = useState<TypeChoice[] | []>([])
    const [company, setCompany] = useState<CreateCompany>({
        account: Number.parseInt(id || "0"),
        name: "",
        type: ""
    })

    useEffect(() => {
        const config: AxiosRequestConfig = {
            headers: getAuthHeaders(accessToken)
        }
        axios.get(CompanyTypesUrl, config)
            .then((response) => {
                setTypeChoices(response.data.map(
                    (typeChoice: PassToServerTypeChoice) => snakeToCamel<PassToServerTypeChoice, TypeChoice>(typeChoice)
                ))
            })
            .catch((error) => alert('Fetch error\n' + error))
    }, [])

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name: string = event.target.name
        const value: string = event.target.value;
        setCompany({ ...company, [name]: value } as CreateCompany)
    }

    const onSave = () => {
        const accessToken = localStorage.getItem('access') || ""
        const config: AxiosRequestConfig = {
            headers: getAuthHeaders(accessToken)
        }
        axios.post(CompanyListUrl, company, config)
            .then((response) => { setCreatedCompanyId(response.data.account) })
            .catch((error) => alert('Fetch error\n' + error))
    }

    const classes = useStyles()
    return (
        <form className={classes.form}>
            {createdCompanyId !== 0 && <Redirect to={`/companies/${createdCompanyId}`} />}
            <Typography variant='h4'>
                {props.t("company.titleForCreate")}
            </Typography>
            <TextField name="name" id="name" label={props.t("company.name")} onChange={onChange} />
            <TextField
                id="type"
                name="type"
                select
                label={props.t("company.type")}
                onChange={onChange}
            >
                {typeChoices?.map((option: TypeChoice) => (
                    <MenuItem key={option.label} value={option.value}>
                        {props.t(`company.companyTypes.${option.label}`)}
                    </MenuItem>
                ))}
            </TextField>
            <div>
                <Button className={classes.button} variant="contained" color="primary" onClick={onSave}>
                    {props.t("company.save")}
                </Button>
            </div>
        </form>
    )
}