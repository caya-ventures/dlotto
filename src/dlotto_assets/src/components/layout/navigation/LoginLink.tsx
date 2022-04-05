import React, { useContext } from 'react';
import { AppContext, ModalContext } from "../../../context";
import {
    Link
} from 'react-router-dom';
import styled from "styled-components";
import { shortenedText } from "../../../utils";

const ICimg = styled.img`
  height: .75rem;
  margin: 0 .5rem 0 0;
  
  &.right-ico {
    margin: 0 0 0 .5rem;
  }
`;

const LoginLink = () => {
    const { isAuthenticated, login, profile } = useContext(AppContext);
    const { setAuthModal } = useContext(ModalContext);

    const username = profile?.bio?.username || 'Account';

    return (
        isAuthenticated
            ? <button className={"btn btn-primary"} onClick={() => setAuthModal(true)} title={username}>
                {shortenedText(username)}
                <ICimg src="assets/ic-badge.svg" alt="Internet Computer" className={"right-ico"}/>
            </button>
            : <Link to='/' onClick={login} className="btn btn-primary">
                <ICimg src="assets/ic-badge.svg" alt="Internet Computer"/>
                Login
            </Link>
    );
}

export default LoginLink;
