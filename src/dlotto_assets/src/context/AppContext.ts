import * as React from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { ActorSubclass } from '@dfinity/agent';
import { _SERVICE, ProfileUpdate } from '../../../declarations/dlotto/dlotto.did';
import { emptyProfile } from '../utils';

export const AppContext = React.createContext<{
    authClient?: AuthClient;
    setAuthClient?: React.Dispatch<AuthClient>;
    isAuthenticated?: boolean;
    setIsAuthenticated?: React.Dispatch<React.SetStateAction<boolean>>;
    login: () => void;
    logout: () => void;
    actor?: ActorSubclass<_SERVICE>;
    profile?: ProfileUpdate;
    updateProfile?: React.Dispatch<ProfileUpdate>;
    hasLoggedIn: boolean;
    balance: string;
}>({
    login: () => {
    },
    logout: () => {
    },
    profile: emptyProfile,
    hasLoggedIn: false,
    balance: '',
});

export default AppContext;
