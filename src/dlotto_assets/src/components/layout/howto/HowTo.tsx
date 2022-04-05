import React from 'react';
import HowToItem from "./HowToItem";
import styled from "styled-components";
import { howToItems } from "./HowToItems";
import { mainBlockTitle, mainContentWrapper } from "../../../styles/utils";

const HowToStyled = styled.div`
  padding: 2rem 1rem;
`;

const Title = styled.h2`
  text-align: center;
  margin: 0 0 1rem 0;
  ${ mainBlockTitle };
`;

const Ul = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  ${ mainContentWrapper };
`;

const HowTo = () => {
    return (
        <HowToStyled>
            <Title>How to participate</Title>
            <Ul>
                {howToItems.map(item => <HowToItem key={item.mark} {...item}/>)}
            </Ul>
        </HowToStyled>
    );
}

export default HowTo;
