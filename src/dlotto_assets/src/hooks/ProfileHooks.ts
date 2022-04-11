import { ActorSubclass, Identity } from '@dfinity/agent';
import { _SERVICE, ProfileUpdate } from '../../../declarations/dlotto/dlotto.did';
import { useEffect, useState } from 'react';
import { get, remove, set } from 'local-storage';
import { emptyProfile, profilesMatch } from '../utils';
import toast from 'react-hot-toast';
import * as React from 'react';

type UseProfileProps = {
    identity?: Identity;
    hasLoggedIn: boolean;
    actor?: ActorSubclass<_SERVICE>;
    setIsAuthenticated?: React.Dispatch<React.SetStateAction<boolean>>;
    logout?: () => void;
};

export function useProfile(props: UseProfileProps) {
    const { identity, hasLoggedIn, actor, setIsAuthenticated, logout } = props;
    const [ profile, setProfile ] = useState<ProfileUpdate>();

    const updateProfile = (profile: ProfileUpdate | undefined) => {
        if (profile) {
            set('profile', JSON.stringify(profile));
        } else remove('profile');
        setProfile(profile);
    };

    const handleCreationError = () => {
        remove("profile");
        setIsAuthenticated?.(false);
        updateProfile?.(emptyProfile);
        toast.error("There was a problem creating your profile");
    };

    useEffect(() => {
        const stored = JSON.parse(get('profile')) as ProfileUpdate | undefined;
        if (stored) {
            setProfile(stored);
        }
    }, []);

    useEffect(() => {
        hasLoggedIn && actor?.read().then((result) => {
            if ('ok' in result) {
                if (profilesMatch(profile, result.ok)) {
                    return;
                }
                updateProfile(result.ok);
            } else {
                if ('NotAuthorized' in result.err) {
                    toast.error('Your session expired. Please reauthenticate');
                    logout?.();
                } else if ('NotFound' in result.err) {
                    actor?.create().then(async (createResponse) => {
                        if ("ok" in createResponse) {
                            const profileResponse = await actor.read();
                            if ("ok" in profileResponse) {
                                updateProfile(profileResponse.ok);
                                toast("Profile created.");
                            } else {
                                toast.error(profileResponse.err.toString());
                                handleCreationError();
                            }
                        } else {
                            handleCreationError();
                            remove("ic-delegation");
                            toast.error(createResponse.err.toString());
                        }
                    });
                } else {
                    toast.error('Error: ' + Object.keys(result.err)[0]);
                }
            }
        });
    }, [ hasLoggedIn, actor ]);

    if (!identity) return { profile: emptyProfile, updateProfile };

    return { profile, updateProfile };
}
