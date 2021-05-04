import { Button, makeStyles, TextField, Typography } from '@material-ui/core';
import axios from 'axios';
import React, { useState } from 'react';
import { Redirect } from 'react-router';
import { TokenUrl } from '../constants';
import { snakeToCamel } from '../utils';

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

export type Credentials = {
    email: string,
    password: string
}

export type FetchAuthResult = {
    access: string,
    userId: number
    isSuperuser: boolean
}

type LoginProps = {
    isLoggedIn: boolean
    setIsLoggedIn: (isLoggedIn: boolean) => void
}

export const LoginForm = (props: LoginProps) => {
    const [credentials, setCredentials] = useState<Credentials>({
        email: "",
        password: ""
    })

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name: string = event.target.name
        const value: string = event.target.value;
        setCredentials({ ...credentials, [name]: value } as Credentials)
    }

    const onClick = () => {
        axios.post(TokenUrl, credentials)
            .then(response => snakeToCamel<FetchAuthResult>(response.data))
            .then(data => {
                localStorage.setItem('access', data.access)
                localStorage.setItem('userId', data.userId.toString())
                localStorage.setItem('isAdmin', data.isSuperuser.toString())
            })
            .finally(() => props.setIsLoggedIn(true))
    }

    const classes = useStyles()
    return (
        <form className={classes.form}>
            {props.isLoggedIn && <Redirect to="info/" />}
            <Typography variant='h4'>
                Sign in to your account
            </Typography>
            <TextField id="email" name="email" label="Email address" type="email" onChange={onChange} />
            <TextField id="password" name="password" label="Password" type="password" onChange={onChange} />
            <div>
                <Button className={classes.button} variant="contained" color="primary" onClick={onClick}>
                    Login
                </Button>
            </div>
        </form>
    )
}