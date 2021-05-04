import { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Header } from './components/Header';
import { Menu } from './components/Menu';
import { Container, makeStyles, Toolbar } from '@material-ui/core';
import { UserInfoForm } from './user/InfoForm';
import { CompanyList } from './admin/CompanyList';
import { LoginForm } from './user/LoginForm';

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

export type UserProps = {
  id: number,
  accessToken: string
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(Boolean(localStorage.getItem('userId')))
  const classes = useStyles()
  return (
    <Router>
      <div className={classes.app}>
        <Header />
        <Menu isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <main className={classes.main}>
          <Toolbar />
          <Container className={classes.container}>
            <Switch>
              <Route path="/companies">
                <CompanyList />
              </Route>
              <Route path="/info">
                <UserInfoForm />
              </Route>
              <Route path="/">
                <LoginForm isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
              </Route>
            </Switch>
            {/* <CreateCompanyForm loading={false} typeChoices={[{ value: 'value1', label: 'label1' }, { value: 'value2', label: 'label2' }, { value: 'value3', label: 'label3' }]} /> */}
          </Container>
        </main>
      </div>
    </Router >
  );
}

export default App;
