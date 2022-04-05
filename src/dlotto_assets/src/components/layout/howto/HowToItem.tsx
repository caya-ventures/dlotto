import React from 'react';
import styled from "styled-components";
import { HowToItem } from "./HowToItems";
import { baseTheme } from "../../../styles/theme";

const HowToItemStyled = styled.li<{bgImg: string}>`
  padding: 8rem 0 1rem 0;
  width: 31%;
  border-radius: 1rem;
  background: ${ baseTheme.colors.bgSecondary  } url('${ ({bgImg}) => bgImg }') 50% 0 no-repeat;
  background-size: 80% auto;
  position: relative;
  text-align: center;
  transition: all .5s;;
  box-shadow: 0 0 60px rgba(255, 219, 75, 0.1);
  
  &:hover {
    background-position: 40% 0;
    background-size: 90% auto;
  }
`;

const HowToMark = styled.span`
  position: absolute;
  top: 1.25rem;
  left: 1.25rem;
  background: rgba(255, 226, 112, 0.05);
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  line-height: 2rem;
  font-size: 1rem;
  color: ${ baseTheme.colors.textAction };
`;

const HowToTitle = styled.h3`
  line-height: 2rem;
  font-size: 1rem;
  color: ${ baseTheme.colors.textAction };
`;

const HowToText = styled.div`
  padding: 0 1rem;
  font-size: 1rem;
`;

const HowToItem = ({ bgImg, mark, title, text}: HowToItem) => {
    return (
        <HowToItemStyled bgImg={bgImg}>
            <HowToMark>{mark}</HowToMark>
            <HowToTitle>{title}</HowToTitle>
            <HowToText>{text}</HowToText>
        </HowToItemStyled>
    );
}

export default HowToItem;
