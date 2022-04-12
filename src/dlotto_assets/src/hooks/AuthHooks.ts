import { useEffect, useState } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { ActorSubclass } from '@dfinity/agent';
import { canisterId, createActor, dlotto } from '../../../declarations/dlotto';
import { _SERVICE } from '../../../declarations/dlotto/dlotto.did';
import { clear } from 'local-storage';
import { useAsync } from 'react-async-hook';


type UseAuthClientProps = {};

export function useAuthClient(props?: UseAuthClientProps) {
    const [ authClient, setAuthClient ] = useState<AuthClient>();
    const [ actor, setActor ] = useState<ActorSubclass<_SERVICE>>();
    const [ isAuthenticated, setIsAuthenticated ] = useState<boolean>(false);
    const [ hasLoggedIn, setHasLoggedIn ] = useState(false);
    const [ balance, setBalance ] = useState<string>('');

    const getUserBalance = async () => await dlotto.userBalance();
    let balanceCalc = Number( useAsync(getUserBalance, []).result?.e8s)/100000000;
    let userBalance = balanceCalc.toFixed(3);


    const login = () => {
        authClient?.login({
            identityProvider: process.env.II_URL,
            onSuccess: () => {
                initActor();
                setIsAuthenticated(true);
                setBalance(userBalance);
                setTimeout(() => {
                    setHasLoggedIn(true);
                }, 100);
            },
        });
    };

    const initActor = () => {
        const actor = createActor(canisterId as string, {
            agentOptions: {
                identity: authClient?.getIdentity(),
            },
        });
        setActor(actor);
    };

    const logout = () => {
        clear();
        setIsAuthenticated(false);
        setActor(undefined);
    };


    useEffect(() => {
        AuthClient.create().then(async (client) => {
            const isAuthenticated = await client.isAuthenticated();
            setAuthClient(client);
            setIsAuthenticated(isAuthenticated);
            initActor();
        });
    }, []);

    useEffect(() => {
        if (isAuthenticated) initActor();
    }, [ isAuthenticated ]);

    useEffect(() => {
        setBalance(userBalance);
    }, [ userBalance ]);

    return {
        authClient,
        setAuthClient,
        isAuthenticated,
        setIsAuthenticated,
        login,
        logout,
        actor,
        hasLoggedIn,
        balance,
    };
}
