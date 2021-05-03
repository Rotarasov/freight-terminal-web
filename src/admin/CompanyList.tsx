import { Button, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import React from 'react';
import { Company } from './CompanyDetail';

const useStyles = makeStyles((theme) => ({
    tableContainer: {
        width: '60%',
        height: '60%',
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

export type CompanyListProps = {
    loading: boolean,
    companies?: Company[],
    setCompanies: (companies: Company[]) => void
}

export const CompanyList = (props: CompanyListProps) => {
    const classes = useStyles()
    let companies: Company[] = [
        { name: 'Company', type: 'Sea' },
        { name: 'Company', type: 'Sea' },
        { name: 'Company', type: 'Sea' },
        { name: 'Company', type: 'Sea' },
        { name: 'Company', type: 'Sea' },
        { name: 'Company', type: 'Sea' }
    ]
    return (
        <div className={classes.tableContainer}>
            <Typography variant='h4'>
                All companies
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell align="right">
                            <Button className={classes.addButton} variant="contained" color="primary">
                                Create Company
                            </Button>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Company</TableCell>
                        <TableCell align="right">Type</TableCell>
                        <TableCell align="right">Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {companies.map((company) => (
                        <TableRow key={company.name}>
                            <TableCell component="th" scope="row">
                                {company.name}
                            </TableCell>
                            <TableCell align="right">{company.type}</TableCell>
                            <TableCell align="right">
                                <Button className={classes.button} variant="contained" color="default">
                                    Detail
                                </Button>
                                <Button className={classes.lastButton} variant="contained" color="secondary">
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}