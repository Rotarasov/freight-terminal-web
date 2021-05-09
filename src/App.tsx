import { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Header } from './components/Header';
import { Menu } from './components/Menu';
import { Container, createMuiTheme, makeStyles, ThemeProvider, Toolbar } from '@material-ui/core';
import { UserInfoForm } from './user/InfoForm';
import { CompanyList } from './admin/CompanyList';
import { LoginForm } from './user/LoginForm';
import { useTranslation } from 'react-i18next';
import './i18n/i18n';

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
  const { t, i18n } = useTranslation();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(Boolean(localStorage.getItem('userId')))

  const classes = useStyles()
  return (
    <Router>
      <div className={classes.app}>
        <Header />
        <Menu isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} t={t} i18n={i18n} />
        <main className={classes.main}>
          <Toolbar />
          <Container className={classes.container}>
            <Switch>
              <Route path="/companies">
                <CompanyList />
              </Route>
              <Route path="/info">
                <UserInfoForm t={t} />
              </Route>
              <Route path="/">
                <LoginForm isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} t={t} />
              </Route>
            </Switch>
          </Container>
        </main>
      </div>
    </Router >
  );
}

export default App;
