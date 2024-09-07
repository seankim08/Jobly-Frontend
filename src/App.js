import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';
import CompanyList from './components/CompanyList';
import CompanyDetail from './components/CompanyDetail';
import JobList from './components/JobList';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import ProfileForm from './components/ProfileForm';
import PrivateRoute from './components/PrivateRoute';
import UserContext from './contexts/UserContext';
import JoblyApi from './api/api';
import './App.css';
import './components/styles.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('jobly-token'));
  const [infoLoaded, setInfoLoaded] = useState(false);

  useEffect(() => {
    console.debug("App useEffect loadUserInfo", "token=", token);

    async function getCurrentUser() {
      if (token) {
        try {
          let { username } = JSON.parse(atob(token.split('.')[1]));
          // put the token on the Api class so it can use it to call the API.
          JoblyApi.token = token;
          let currentUser = await JoblyApi.getCurrentUser(username);
          setCurrentUser(currentUser);
        } catch (err) {
          console.error("App loadUserInfo: problem loading", err);
          setCurrentUser(null);
        }
      }
      setInfoLoaded(true);
    }

    // set infoLoaded to false while async getCurrentUser runs; once the
    // data is fetched (or even if an error happens!), this will be set back
    // to false to control the spinner.
    setInfoLoaded(false);
    getCurrentUser();
  }, [token]);

  function logout() {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('jobly-token');
  }

  async function login(loginData) {
    try {
      let token = await JoblyApi.login(loginData);
      setToken(token);
      localStorage.setItem('jobly-token', token);
      return { success: true };
    } catch (errors) {
      console.error("login failed", errors);
      return { success: false, errors };
    }
  }

  async function signup(signupData) {
    try {
      let token = await JoblyApi.signup(signupData);
      setToken(token);
      localStorage.setItem('jobly-token', token);
      return { success: true };
    } catch (errors) {
      console.error("signup failed", errors);
      return { success: false, errors };
    }
  }

  function hasAppliedToJob(id) {
    return currentUser.applications.includes(id);
  }

  function applyToJob(id) {
    if (hasAppliedToJob(id)) return;
    JoblyApi.applyToJob(currentUser.username, id);
    setCurrentUser(c => ({
      ...c,
      applications: [...c.applications, id],
    }));
  }

  if (!infoLoaded) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ currentUser, setCurrentUser, hasAppliedToJob, applyToJob }}>
        <div className="App">
          <NavBar logout={logout} />
          <main>
            <Routes>
				<Route path="/" element={<Home />} />
				<Route path="/companies" element={<PrivateRoute><CompanyList /></PrivateRoute>} />
				<Route path="/companies/:handle" element={<PrivateRoute><CompanyDetail /></PrivateRoute>} />
				<Route path="/jobs" element={<PrivateRoute><JobList /></PrivateRoute>} />
				<Route path="/login" element={<LoginForm login={login} />} />
				<Route path="/signup" element={<SignupForm signup={signup} />} />
				<Route path="/profile" element={<PrivateRoute><ProfileForm /></PrivateRoute>} />
			</Routes>
          </main>
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;