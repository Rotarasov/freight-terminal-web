import React from 'react';
import { Button, FormControl, Input, InputLabel, makeStyles, TextField, Typography } from '@material-ui/core';

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

export type User = {
    id: number,
    firstName: string,
    lastName: string,
    email: string
    isSuperuser: boolean,
}

export type UserInfoProps = {
    loading: boolean,
    user?: User,
    setUser: (user?: User) => void
}

export const UserInfoForm = (props: UserInfoProps) => {
    const classes = useStyles()
    return (
        <form className={classes.form}>
            <Typography variant='h4'>
                My account
            </Typography>
            <TextField id="email" label="Email address" value={props.user?.email} />
            <TextField id="firstName" label="First Name" value={props.user?.firstName} />
            <TextField id="lastName" label="Last Name" value={props.user?.lastName} />
            <div>
                <Button className={classes.button} variant="contained" color="primary">
                    Save
                </Button>
            </div>
        </form>
    )
}