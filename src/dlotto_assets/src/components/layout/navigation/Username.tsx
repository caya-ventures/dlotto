import React, { useContext } from 'react';
import { AppContext } from "../../../context";
import styled from "styled-components";

const Bio = styled.div`
  font-size: 0.8rem;
  padding: 0 1rem;
`;
const Username = () => {
    const {
        profile,
        isAuthenticated,
    } = useContext(AppContext);

    if (!profile) return null;

    const { username } = profile.bio;

    return (
        isAuthenticated
            ? <Bio>{username}</Bio>
            : <></>
    );
};

export default Username;
