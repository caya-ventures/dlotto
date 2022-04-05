import React from 'react';
import styled from "styled-components";
import { baseTheme } from "../../../styles/theme";
import { Ticket } from '../../../../../declarations/dlotto/dlotto.did';
import { DRAWS_CONFIG } from './DrawsConfig';

const MatchesStyled = styled.div`
  background: ${baseTheme.colors.bgSecondary};
  padding: 1.25rem 2.5rem;
`;

const MatchesTitle = styled.p`
  margin: 0 0 1rem 0;
`;

const MatchesList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 1rem;
  row-gap: 1rem;
`;

const MatchesListItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.4);
  border-radius: .25rem;
  padding: 1rem;
`;

const MatchesInfo = styled.p`
  margin: 0;
`;


const MatchesPrize = styled.p`
  font-weight: 700;
  font-size: 1.5rem;
  color: ${baseTheme.colors.textAction};
  margin: 0;
`;

const DrawsMatches = ({ isActive, ticket }: { isActive: boolean; ticket: Ticket | undefined; }) => {

    if (!isActive) {
        return null;
    }

    return (
        <MatchesStyled>
            <MatchesTitle>Match numbers to get prizes. Prizes based on current jackpot:</MatchesTitle>
            <MatchesList>
                {
                    DRAWS_CONFIG.map(item => <MatchesListItem key={item.title}>
                        <MatchesInfo>{item.title}</MatchesInfo>
                        <MatchesPrize>{item.icp || `~${ticket?.round.prize_pot}`} ICP</MatchesPrize>
                    </MatchesListItem>)
                }
            </MatchesList>
        </MatchesStyled>
    );
};

export default DrawsMatches;
