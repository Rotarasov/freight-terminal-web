import React from 'react';
import { Button, makeStyles, TextField, Typography } from '@material-ui/core';
import { useUser } from './hooks/useUser';
import { UserDetailUrl } from '../constants';
import axios, { AxiosRequestConfig } from 'axios';
import { fillUrl } from '../utils';
import { camelToSnake } from '../utils';

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


export const UserInfoForm = () => {
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
        axios.patch(fillUrl(UserDetailUrl, { pk: user?.id.toString() }), camelToSnake<User>(user), config)
            .catch((error) => alert('Fetch error\n' + error))
    }
    return (
        <form className={classes.form}>
            <Typography variant='h4'>
                My account
            </Typography>
            <TextField id="email" name="email" label="Email address" value={user?.email} onChange={onChange} InputLabelProps={{ shrink: true }} />
            <TextField id="firstName" name="firstName" label="First Name" value={user?.firstName} onChange={onChange} InputLabelProps={{ shrink: true }} />
            <TextField id="lastName" name="lastName" label="Last Name" value={user?.lastName} onChange={onChange} InputLabelProps={{ shrink: true }} />
            <div>
                <Button className={classes.button} variant="contained" color="primary" onClick={onClick}>
                    Save
                </Button>
            </div>
        </form>
    )
}