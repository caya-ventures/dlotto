import React, { useContext } from 'react';
import styled from "styled-components";
import { baseTheme } from "../../../styles/theme";
import { pluralPipe } from "../../../utils/";
import { AppContext, ModalContext } from "../../../context";

const DrawsInfoStyled = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  align-content: space-around;
  column-gap: 1rem;
  row-gap: 1rem;
  padding: 1rem 0;
`;

const DrawsInfoBlock = styled.div`
  place-self: center stretch;
  text-align: left;
  opacity: 1;
  transition: opacity .4s;
  
  &.loading {
    opacity: 0.1;
  }
`;

const PrizeInfoTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  white-space: nowrap;
`;

const PrizePot = styled.p`
  margin: 0;
  font-weight: 700;
  font-size: 1.75rem;
  color: ${baseTheme.colors.textAction};
`;

const PrizeInfoLine = styled.p`
  margin: .5rem 0;
`;

const UserTickets = styled.span`
  font-weight: 700;
  color: ${baseTheme.colors.textAction};
`;

const DrawsInfo = ({ prizePot, ticketsCount, isLoading }: { prizePot: bigint | undefined; ticketsCount: number; isLoading: boolean; }) => {

    const { isAuthenticated, login } = useContext(AppContext);
    const { setUserTicketsModal } = useContext(ModalContext);

    const onViewTicketsClick = () => {
        if (isLoading) return;
        setUserTicketsModal(true);
    }

    return (
        <DrawsInfoStyled>
            <DrawsInfoBlock>
                <PrizeInfoTitle>Prize pot</PrizeInfoTitle>
            </DrawsInfoBlock>
            <DrawsInfoBlock>
                <PrizePot>{Number(prizePot)} ICP</PrizePot>
            </DrawsInfoBlock>
            <DrawsInfoBlock>
                <PrizeInfoTitle>Your tickets:</PrizeInfoTitle>
            </DrawsInfoBlock>
            <DrawsInfoBlock className={isLoading ? 'loading' : ''}>
                {
                    isAuthenticated ?
                        <>
                            <PrizeInfoLine>
                                You have <UserTickets>
                                {isLoading ? '..' : ticketsCount ?? 0}</UserTickets> {pluralPipe(ticketsCount, 'ticket')} in
                                this round
                            </PrizeInfoLine>
                            <PrizeInfoLine className="clickable bold" onClick={onViewTicketsClick}>View
                                my tickets</PrizeInfoLine>
                        </> :
                        <PrizeInfoLine>
                            <UserTickets className="clickable" onClick={login}>Login</UserTickets> to check your winnings
                        </PrizeInfoLine>
                }
            </DrawsInfoBlock>
        </DrawsInfoStyled>
    );
};

export default DrawsInfo;
