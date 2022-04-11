import { ActorSubclass } from '@dfinity/agent';
import { canisterId, createActor } from '../../../declarations/ledger';
import { _SERVICE } from '../../../declarations/ledger/ledger.did';
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context";

export function useLedgerClient() {

    const { authClient, isAuthenticated } = useContext(AppContext);
    const [ actorLedger, setActorLedger ] = useState<ActorSubclass<_SERVICE>>();

    useEffect(() => {
        if (isAuthenticated) initActor();
    }, [ isAuthenticated ]);

    const initActor = () => {
        const actor = createActor(canisterId as string, {
            agentOptions: {
                identity: authClient?.getIdentity(),
            },
        });
        setActorLedger(actor);
    };

    return {
        actorLedger
    }
}
