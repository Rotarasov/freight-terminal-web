import React from 'react';
import { Header } from './components/Header';
import { Menu } from './components/Menu';
import { Container, makeStyles, Paper, Toolbar } from '@material-ui/core';
import { User, UserInfoForm } from './user/InfoForm';
import { CompanyList } from './admin/CompanyList';
import { Company, CompanyDetail } from './admin/CompanyDetail';
import { CreateCompanyForm } from './admin/CreateCompanyForm';
import { useUser } from './user/hooks/useUser';
import { useAuth } from './components/hooks/useAuth';

const useStyles = makeStyles((theme) => ({
  app: {
    display: 'flex',
    height: '100vh'
  },
  main: {
    flexGrow: 4,
  },
  container: {
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }
}))

function App() {
  var { loading, auth } = useAuth({ email: "admin@example.com", password: "admin" })
  var { loading, user, setUser } = useUser(1, auth);

  const classes = useStyles()
  return (
    <div className={classes.app}>
      <Header />
      <Menu isAdmin={true} />
      <main className={classes.main}>
        <Toolbar />
        <Container className={classes.container}>
          <UserInfoForm loading={loading} user={user} setUser={setUser} />
          {/* <CompanyList loading={false} setCompanies={(companies?: Company[]) => { }} /> */}
          {/* <CompanyDetail loading={false} typeChoices={[{ value: 'value1', label: 'label1' }, { value: 'value2', label: 'label2' }, { value: 'value3', label: 'label3' }]} setCompany={(company?: Company) => { }} /> */}
          {/* <CreateCompanyForm loading={false} typeChoices={[{ value: 'value1', label: 'label1' }, { value: 'value2', label: 'label2' }, { value: 'value3', label: 'label3' }]} /> */}
        </Container>
      </main>
    </div>
  );
}

export default App;
