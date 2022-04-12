import { ProfileUpdate } from '../../../declarations/dlotto/dlotto.did';
import assert from 'assert';

export const profilesMatch = (
    p1: undefined | ProfileUpdate,
    p2: ProfileUpdate
) => {
    try {
        assert.deepEqual(p1, p2);
        return true;
    } catch (error) {
        return false;
    }
};

export const emptyProfile: ProfileUpdate = {
    bio: {
        username: "",
    },
};
