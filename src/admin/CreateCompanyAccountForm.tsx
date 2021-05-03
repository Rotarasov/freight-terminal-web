import { Button, makeStyles, TextField, Typography } from "@material-ui/core"
import React from "react"

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

export const CreateUserForm = () => {
    const classes = useStyles()
    return (
        <form className={classes.form}>
            <Typography variant='h4'>
                Create account for company manager
            </Typography>
            <TextField id="email" label="Email address" />
            <TextField id="firstName" label="First Name" />
            <TextField id="lastName" label="Last Name" />
            <div>
                <Button className={classes.button} variant="contained" color="primary">
                    Create
                </Button>
            </div>
        </form>
    )
}