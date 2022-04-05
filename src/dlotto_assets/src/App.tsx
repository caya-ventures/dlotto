import React, { useEffect } from 'react';
import { Header, Footer } from './components/layout';
import { Home, BuyPage } from './components/pages';
import { useAuthClient, useProfile, profilesMatch, emptyProfile, useModalClient } from './hooks';
import { createBrowserHistory } from 'history';
import toast from 'react-hot-toast';
import { remove } from 'local-storage';
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
    const { profile, updateProfile } = useProfile({ identity });

    function handleCreationError() {
        remove("profile");
        setIsAuthenticated?.(false);
        updateProfile?.(emptyProfile);
        toast.error("There was a problem creating your profile");
    }

    useEffect(() => {

        if (actor) {
            actor.read().then((result) => {
                if ('ok' in result) {
                    if (profilesMatch(profile, result.ok)) {
                        return;
                    }
                    updateProfile(result.ok);
                } else {
                    if ('NotAuthorized' in result.err) {
                        toast.error('Your session expired. Please reauthenticate');
                        logout();
                    } else if ('NotFound' in result.err) {
                        actor?.create().then(async (createResponse) => {
                            if ("ok" in createResponse) {
                                const profileResponse = await actor.read();
                                if ("ok" in profileResponse) {
                                    console.log("Profile created.");
                                } else {
                                    console.error(profileResponse.err);
                                    handleCreationError();
                                }
                            } else {
                                handleCreationError();
                                remove("ic-delegation");
                                console.error(createResponse.err);
                            }
                        });
                    } else {
                        toast.error('Error: ' + Object.keys(result.err)[0]);
                    }
                }
            });
        }
    }, [ actor, hasLoggedIn ]);

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
                balance
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