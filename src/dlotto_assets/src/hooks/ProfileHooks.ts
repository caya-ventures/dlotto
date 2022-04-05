import {Identity} from '@dfinity/agent';
import {ProfileUpdate} from '../../../declarations/dlotto/dlotto.did';
import assert from 'assert';
import { isDelegationValid } from "@dfinity/authentication";
import { DelegationChain } from "@dfinity/identity";
import {useEffect, useState} from 'react';
import {get, remove, set} from 'local-storage';

type UseProfileProps = {
    identity?: Identity;
};

export function profilesMatch(
    p1: undefined | ProfileUpdate,
    p2: ProfileUpdate
) {
    try {
        assert.deepEqual(p1, p2);
        return true;
    } catch (error) {
        return false;
    }
}

export function useProfile(props: UseProfileProps) {
    const { identity } = props;
    const [ profile, setProfile ] = useState<ProfileUpdate>();

    const updateProfile = (profile: ProfileUpdate | undefined) => {
        if (profile) {
            set('profile', JSON.stringify(profile));
        } else remove('profile');
        setProfile(profile);
    };

    useEffect(() => {
        const stored = JSON.parse(get('profile')) as ProfileUpdate | undefined;
        if (stored) {
            setProfile(stored);
        }
    }, []);

    if (!identity) return { profile: emptyProfile, updateProfile };

    return { profile, updateProfile };
}

export const emptyProfile: ProfileUpdate = {
    bio: {
        username: "",
    },
};

export function checkDelegation() {
    const delegations = localStorage.getItem("ic-delegation");
    if (!delegations) return false;
    const chain = DelegationChain.fromJSON(delegations);
    return isDelegationValid(chain);
  }
