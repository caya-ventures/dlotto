import React from 'react';
import { Link } from 'react-router-dom';
import styled from "styled-components";
import { baseTheme } from "../../../styles/theme";
import { mainWideWrapper } from "../../../styles/utils";
import { ScrollTop } from "../";

const MainFooter = styled.footer`
  padding: 1.5rem;
  background-color: ${baseTheme.colors.bgSecondary};
`;

const MainFooterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${mainWideWrapper};
`;

const MainFooterLinks = styled.div`
  text-align: left;
  
  a{
    margin-right: 2rem;
  }
`;


const Footer = () => {
    return (
        <MainFooter>
            <MainFooterWrapper>
                <MainFooterLinks>
                    <Link to={{ pathname: 'https://caya.cc' }} target='_blank'>
                        <img src="/footer/caya.png" alt="CAYA"/>
                    </Link>
                    <Link to={{ pathname: 'https://dfinity.org' }} target='_blank'>
                        <img src="/footer/dfinity.png" alt="DFINITY"/>
                    </Link>
                </MainFooterLinks>
                <ScrollTop/>
            </MainFooterWrapper>
        </MainFooter>
    );
}

export default Footer;
