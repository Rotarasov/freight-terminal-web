import { Button, makeStyles, TextField, Typography } from "@material-ui/core"
import axios from "axios"
import React, { useState } from "react"
import { DefaultNamespace, TFunction } from "react-i18next"
import { Redirect, Route, useRouteMatch, Switch } from "react-router"
import { UserListUrl } from "../constants"
import { User } from "../user/InfoForm"
import { camelToSnake } from "../utils"
import { CreateCompanyForm } from "./CreateCompanyForm"

const useStyles = makeStyles((theme) => ({
    form: {
        width: '60%',
        height: '60%',
        display: 'flex',
        flexDirection: 'column',
    },
    button: {
        justifySelf: 'flex-end',
        marginTop: theme.spacing(3),
        width: '30%'
    }
}))

export type CreateUser = {
    email: string,
    firstName: string,
    lastName: string,
}

type CreateUserFormProps = {
    t: TFunction<DefaultNamespace>
}

export const CreateUserForm = (props: CreateUserFormProps) => {
    const { url, path } = useRouteMatch()
    const [createdUserId, setCreatedUserId] = useState<number>(0)
    const [user, setUser] = useState<CreateUser>({
        email: "",
        firstName: "",
        lastName: "",
    })

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name: string = event.target.name
        const value: string = event.target.value;
        setUser({ ...user, [name]: value } as User)
    }

    const onCreate = () => {
        axios.post(UserListUrl, camelToSnake<CreateUser>(user))
            .then((response) => setCreatedUserId(response.data.id))
            .catch((error) => alert('Error\n' + error))
    }

    const classes = useStyles()
    console.log(createdUserId)
    return (
        <Switch>
            <Route path={`${path}/:id/create-company`}>
                <CreateCompanyForm t={props.t} />
            </Route>
            <Route path={path}>
                <form className={classes.form}>
                    {createdUserId !== 0 && <Redirect to={`${url}/${createdUserId}/create-company`} />}
                    <Typography variant='h4'>
                        {props.t("companyAccount.title")}
                    </Typography>
                    <TextField name="email" id="email" label={props.t("companyAccount.email")} onChange={onChange} />
                    <TextField name="firstName" id="firstName" label={props.t("companyAccount.firstName")} onChange={onChange} />
                    <TextField name="lastName" id="lastName" label={props.t("companyAccount.lastName")} onChange={onChange} />
                    <TextField name="password" id="password" label={props.t("companyAccount.password")} type="password" onChange={onChange} />
                    <div>
                        <Button className={classes.button} variant="contained" color="primary" onClick={onCreate}>
                            {props.t("companyAccount.next")}
                        </Button>
                    </div>
                </form>
            </Route>
        </Switch>
    )
}