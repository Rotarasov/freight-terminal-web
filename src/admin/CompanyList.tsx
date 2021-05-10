import { Button, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import axios, { AxiosRequestConfig } from 'axios';
import React from 'react';
import { DefaultNamespace, TFunction } from 'react-i18next';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import { CompanyDetailUrl } from '../constants';
import { fillUrl, getAuthHeaders } from '../utils';
import { Company, CompanyDetail, TypeChoice } from './CompanyDetail';
import { CreateUserForm } from './CreateCompanyAccountForm';
import { useCompanies } from './hooks/useCompanies';

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

type CompanyListProps = {
    t: TFunction<DefaultNamespace>
}

export const CompanyList = (props: CompanyListProps) => {
    const { path, url } = useRouteMatch()
    const { loading, companies, typeChoices } = useCompanies()
    const classes = useStyles()

    const onDelete = (event: React.MouseEvent<HTMLElement>) => {
        const target = event.currentTarget
        const account: string | null = target.getAttribute('id')
        if (!account) {
            return
        }
        const accessToken = localStorage.getItem('access') || ""
        const config: AxiosRequestConfig = {
            headers: getAuthHeaders(accessToken)
        }
        axios.delete(fillUrl(CompanyDetailUrl, { pk: account }), config)
            .catch((error) => alert('Fetch error\n' + error))

        window.location.reload()
    }

    return (
        <Switch>
            <Route path={`${path}/create-account`}>
                <CreateUserForm t={props.t} />
            </Route>
            <Route path={`${path}/:id`}>
                <CompanyDetail t={props.t} />
            </Route>
            <Route path={path}>
                <div className={classes.tableContainer}>
                    <Typography variant='h4'>
                        {props.t("companies.title")}
                    </Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell align="right">
                                    <Button component={Link} to={`${url}/create-account`} className={classes.addButton} variant="contained" color="primary">
                                        {props.t("companies.create")}
                                    </Button>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>{props.t("companies.company")}</TableCell>
                                <TableCell align="right">{props.t("companies.type")}</TableCell>
                                <TableCell align="right">{props.t("companies.action")}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {companies.map((company: Company) => (
                                <TableRow key={company.account}>
                                    <TableCell component="th" scope="row">
                                        {company.name}
                                    </TableCell>
                                    <TableCell align="right">
                                        {props.t("company.companyTypes." +
                                            typeChoices.find((typeChoice: TypeChoice) => typeChoice.value === company.type)?.label)}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button component={Link} to={`${url}/${company.account}`} className={classes.button} variant="contained" color="default">
                                            {props.t("companies.detail")}
                                        </Button>
                                        <Button id={company.account.toString()} className={classes.lastButton} variant="contained" color="secondary" onClick={onDelete}>
                                            {props.t("companies.delete")}
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