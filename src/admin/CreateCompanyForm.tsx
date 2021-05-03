import React from 'react';
import { Company, TypeChoice } from './CompanyDetail';
import { Button, FormControl, Input, InputLabel, makeStyles, MenuItem, TextField, Typography } from '@material-ui/core';

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

export type CreateCompanyProps = {
    loading: boolean,
    typeChoices?: TypeChoice[]
}

export const CreateCompanyForm = (props: CreateCompanyProps) => {
    const classes = useStyles()
    return (
        <form className={classes.form}>
            <Typography variant='h4'>
                Create company
            </Typography>
            <TextField id="name" label="Name" />
            <TextField
                id="type"
                select
                label="Type"
            >
                {props.typeChoices?.map((option: TypeChoice) => (
                    <MenuItem key={option.label} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
            <div>
                <Button className={classes.button} variant="contained" color="primary">
                    Create
                </Button>
            </div>
        </form>
    )
}