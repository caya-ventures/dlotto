import { useEffect, useState } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { ActorSubclass } from '@dfinity/agent';
import { canisterId, createActor, dlotto } from '../../../declarations/dlotto';
import { _SERVICE } from '../../../declarations/dlotto/dlotto.did';
import { canisterId as ledgerCanisterId, createActor as createLedger } from '../../../declarations/ledger';
import { _SERVICE as _LEDGER } from '../../../declarations/ledger/ledger.did';
import { clear } from 'local-storage';
import { Principal } from '@dfinity/principal';

type UseAuthClientProps = {};

export function useAuthClient(props?: UseAuthClientProps) {
    const [ authClient, setAuthClient ] = useState<AuthClient>();
    const [ actor, setActor ] = useState<ActorSubclass<_SERVICE>>();
    const [ ledger, setLedger ] = useState<ActorSubclass<_LEDGER>>();
    const [ isAuthenticated, setIsAuthenticated ] = useState<boolean>(false);
    const [ hasLoggedIn, setHasLoggedIn ] = useState(false);
    const [ balance, setBalance ] = useState<string>('0');

    useEffect(() => {
        AuthClient.create().then(async (client) => {
            const isAuthenticated = await client.isAuthenticated();
            setAuthClient(client);
            setIsAuthenticated(isAuthenticated);
            isAuthenticated && initActors();
        });
    }, []);

    useEffect(() => {
        if (isAuthenticated) initActors();
    }, [ isAuthenticated ]);

    useEffect(() => {
        if (!authClient || !ledger) {
            return;
        }
        updateBalance();
    }, [ ledger, authClient ]);

    const login = () => {
        authClient?.login({
            identityProvider: process.env.II_URL,
            onSuccess: () => {
                setIsAuthenticated(true);
                initActors();
                setTimeout(() => {
                    setHasLoggedIn(true);
                }, 100);
            },
        });
    };

    const initActors = () => {
        if (!authClient?.getIdentity()) return;

        setActor(createActor(canisterId as string, {
            agentOptions: {
                identity: authClient?.getIdentity(),
            },
        }));
        setLedger(createLedger(ledgerCanisterId as string, {
            agentOptions: {
                identity: authClient?.getIdentity(),
            },
        }));
    };

    const updateBalance = () => {
        const getBalance = async () => {
            const principal = authClient?.getIdentity()?.getPrincipal() as Principal;
            const accountId = await dlotto.userAccountIdPublic(principal);
            const balance = await ledger?.account_balance({'account': accountId})
            const balanceCalc = (Number( balance?.e8s)/100000000).toFixed(3);
            setBalance(balanceCalc);
        }
        getBalance();
    }

    const logout = () => {
        clear();
        setIsAuthenticated(false);
        setActor(undefined);
        setLedger(undefined);
        setBalance('0');
    };

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
        ledger,
        updateBalance,
    };
}
