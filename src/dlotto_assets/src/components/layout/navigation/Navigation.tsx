import React from 'react';
import LoginLink from './LoginLink'
import styled from "styled-components";

const Nav = styled.nav`
  display: flex;
  align-items: center;
`;

const Navigation = () => {
    return (
        <Nav>
            <LoginLink/>
        </Nav>
    );
}

export default React.memo(Navigation);
