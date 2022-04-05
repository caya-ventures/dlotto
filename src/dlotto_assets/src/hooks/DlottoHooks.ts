import { ActorSubclass } from '@dfinity/agent';
import { canisterId, createActor } from '../../../declarations/dlotto';
import { _SERVICE } from '../../../declarations/dlotto/dlotto.did';
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context";

export function useDlottoClient() {

    const { authClient, isAuthenticated } = useContext(AppContext);
    const [ actorDlotto, setActorDlotto ] = useState<ActorSubclass<_SERVICE>>();

    useEffect(() => {
        if (isAuthenticated) initActor();
    }, [ isAuthenticated ]);

    const initActor = () => {
        const actor = createActor(canisterId as string, {
            agentOptions: {
                identity: authClient?.getIdentity(),
            },
        });
        setActorDlotto(actor);
    };

    return {
        actorDlotto
    }
}
