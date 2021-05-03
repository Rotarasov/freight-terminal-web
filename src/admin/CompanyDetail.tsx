import React from 'react';
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
        width: '10%'
    }
}))

export type Company = {
    name: string,
    type: string
}

export type TypeChoice = {
    value: string,
    label: string
}

export type CompanyDetailProps = {
    loading: boolean,
    company?: Company,
    typeChoices?: TypeChoice[]
    setCompany: (company: Company) => void
}

export const CompanyDetail = (props: CompanyDetailProps) => {
    const classes = useStyles()
    return (
        <form className={classes.form}>
            <Typography variant='h4'>
                Company
            </Typography>
            <TextField id="name" label="Name" value={props.company?.name} />
            <TextField
                id="type"
                select
                label="Type"
                value={props.company?.type}
            >
                {props.typeChoices?.map(option => (
                    <MenuItem key={option.label} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
            <div>
                <Button className={classes.button} variant="contained" color="primary">
                    Save
                </Button>
                <Button className={classes.button} variant="contained" color="secondary">
                    Delete
                </Button>
            </div>
        </form>
    )
}