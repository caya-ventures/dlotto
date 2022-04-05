import React from 'react';
import { Navigation } from '../index';
import { Link } from 'react-router-dom';
import styled from "styled-components";
import { mainWideWrapper } from "../../../styles/utils";

const MainHeader = styled.header`
  display: flex;
  justify-content: space-between;
  padding: .75rem 1rem;
  ${mainWideWrapper}
`;

const HeaderLogo = styled.img`
  height: 2.5rem;
`;

const Header = () => {
    return (
        <MainHeader>
            <Link to='/'>
                <HeaderLogo src='/dlotto-logo-dark.svg' alt='DLotto'/>
            </Link>
            <Navigation/>
        </MainHeader>
    );
}

export default Header;
