import React from 'react';
import { Button, makeStyles, TextField, Typography } from '@material-ui/core';
import { useUser } from './hooks/useUser';
import { UserDetailUrl } from '../constants';
import axios, { AxiosRequestConfig } from 'axios';
import { fillUrl } from '../utils';
import { camelToSnake } from '../utils';
import { DefaultNamespace, TFunction } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
    form: {
        width: '80%',
        height: '80%',
        display: 'flex',
        flexDirection: 'column',
    },
    button: {
        justifySelf: 'flex-end',
        marginTop: theme.spacing(3),
        width: '30%'
    }
}))

export type User = {
    id: number,
    firstName: string,
    lastName: string,
    email: string
    isSuperuser: boolean,
}

export type PassToServerUser = {
    id: number,
    first_name: string,
    last_name: string,
    email: string,
    is_superuser: string
}

export type UserInfoFormProps = {
    t: TFunction<DefaultNamespace>
}

export const UserInfoForm = (props: UserInfoFormProps) => {
    const userId = Number.parseInt(localStorage.getItem('userId') || "0")
    const accessToken = localStorage.getItem('access') || ""

    const { loading, user, setUser } = useUser(userId, accessToken)
    const classes = useStyles()

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name: string = event.target.name
        const value: string = event.target.value;
        setUser({ ...user, [name]: value } as User)
    }

    const onClick = () => {
        if (!user) {
            return
        }
        const config: AxiosRequestConfig = {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        }
        axios.patch(fillUrl(UserDetailUrl, { pk: user?.id.toString() }), camelToSnake<User, PassToServerUser>(user), config)
            .catch((error) => alert('Fetch error\n' + error))
    }
    return (
        <form className={classes.form}>
            <Typography variant='h4'>
                {props.t("user.title")}
            </Typography>
            <TextField id="email" name="email" label={props.t("user.email")} value={user?.email} onChange={onChange} InputLabelProps={{ shrink: true }} />
            <TextField id="firstName" name="firstName" label={props.t("user.firstName")} value={user?.firstName} onChange={onChange} InputLabelProps={{ shrink: true }} />
            <TextField id="lastName" name="lastName" label={props.t("user.lastName")} value={user?.lastName} onChange={onChange} InputLabelProps={{ shrink: true }} />
            <div>
                <Button className={classes.button} variant="contained" color="primary" onClick={onClick}>
                    {props.t("user.save")}
                </Button>
            </div>
        </form>
    )
}