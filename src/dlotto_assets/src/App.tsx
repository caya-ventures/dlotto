import React from 'react';
import { Header, Footer } from './components/layout';
import { Home, BuyPage } from './components/pages';
import { useAuthClient, useProfile, useModalClient } from './hooks';
import { createBrowserHistory } from 'history';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { AppContext, ModalContext } from './context';
import GlobalStyles from './styles/global';
import styled from "styled-components";
import { Test } from "./components/test";
import { Modal, AuthModal } from "./components/layout/modals";

const MainLayout = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const App = () => {
    const history = createBrowserHistory();
    const {
        authClient,
        setAuthClient,
        isAuthenticated,
        setIsAuthenticated,
        login,
        logout,
        actor,
        hasLoggedIn,
        balance,
    } = useAuthClient();
    const modalClient = useModalClient();
    const identity = authClient?.getIdentity();
    const { profile, updateProfile } = useProfile({ identity, hasLoggedIn, actor, setIsAuthenticated, logout });

    if (!authClient) return null;

    const mainLayout = <>
        <Router>
            <Header/>
            <MainLayout>
                <Route path="/" exact component={Home}/>
                <Route path="/buy" exact component={BuyPage}/>
                <Route path="/test" exact component={Test}/>
            </MainLayout>
            <Footer/>
            <GlobalStyles/>
            <Toaster/>
            <Modal title={'Account'} isVisible={modalClient?.authModal}>
                <AuthModal/>
            </Modal>
        </Router>
    </>;

    return (
        <AppContext.Provider
            value={{
                authClient,
                setAuthClient,
                isAuthenticated,
                setIsAuthenticated,
                login,
                logout,
                profile,
                updateProfile,
                hasLoggedIn,
                balance,
                actor,
            }}
        >
            <ModalContext.Provider
                value={{ ...modalClient }}>
                {mainLayout}
            </ModalContext.Provider>
        </AppContext.Provider>
    );
};

export default React.memo(App);