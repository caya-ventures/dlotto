import React, { useContext, useEffect, useState } from 'react';
import styled from "styled-components";
import { Ticket, UserTicket } from "../../../../../declarations/dlotto/dlotto.did";
import Loader from "../Loader";
import { baseTheme } from "../../../styles/theme";
import { matchUserTickets, pluralPipe } from "../../../utils";
import { AppContext } from "../../../context";

const DrawsBallsStyled = styled.div`
  padding: 1rem 0 1rem 1rem;

  @keyframes ballAppear {
    from {
      opacity: .5;
      width: 2.5rem;
      height: 2.5rem;
    }
    to {
      opacity: 1;
      width: 4.5rem;
      height: 4.5rem;
    }
  }
`;

const WinningText = styled.p`
  text-align: center;
  margin-top: 0;
`;

const MatchText = styled.p`
  text-align: center;
  margin-bottom: 0;
  opacity: 1;
  transition: opacity .4s;

  &.loading {
    opacity: 0.1;
  }
`;

const BallsUl = styled.ul`
  display: flex;
  justify-content: space-between;
  list-style: none;
  padding: .25rem;
  margin: 0 auto;
  width: 27rem;
  height: 5rem;
`;

const BallsLi = styled.li`
  width: 4.5rem;
  height: 4.5rem;
  padding: 0;
  border-radius: 50%;
  background: linear-gradient(117.11deg, #C2C2C2 15.65%, #FFFFFF 81.74%);
  transform: rotate(-10deg);
  display: flex;
  align-items: center;
  animation: ballAppear .5s;
  transition: all .5s;

  &:hover {
    transform: rotate(10deg);
  }

  span {
    display: block;
    width: 2.8rem;
    height: 2.8rem;
    margin: 0 auto;
    background: #fff;
    border-radius: 50%;
    font-size: 1.5rem;
    line-height: 2.8rem;
    text-align: center;
    font-weight: 700;
    color: #2F2F2F;
  }

  &.super {
    background-image: url('../../../../assets/super.png');
    background-size: cover;
  }
`;

const MatchAccent = styled.span`
  font-weight: 700;
  color: ${baseTheme.colors.textAction};
`;

const DrawsBalls = ({
                        ticket,
                        isLoadingTicketInfo,
                        userTickets,
                    }: { ticket: Ticket | undefined; isLoadingTicketInfo: boolean; userTickets: UserTicket[] }) => {

    const { isAuthenticated } = useContext(AppContext);
    const [ winMatches, setWinMatches ] = useState(0 as number);
    const [ ticketMatches, setTicketMatches ] = useState(0 as number);

    if (!ticket) {
        return <Loader/>;
    }

    useEffect(() => {
        if (ticket && userTickets) {
            const { ballMatchCount, ticketIds } = matchUserTickets(userTickets, ticket);
            setWinMatches(ballMatchCount);
            setTicketMatches(ticketIds?.length);
        }
    }, [ userTickets, ticket ]);

    return (
        <DrawsBallsStyled>
            <WinningText>Winning numbers:</WinningText>
            <BallsUl>
                {ticket.regular.map(item => {
                    return <BallsLi key={Number(item)}><span>{Number(item)}</span></BallsLi>;
                })}
                {ticket.super.map(item => {
                    return <BallsLi className="super" key={Number(item)}><span>{Number(item)}</span></BallsLi>;
                })}
            </BallsUl>
            {
                isAuthenticated ?
                    <MatchText className={`${isLoadingTicketInfo ? 'loading' : ''}`}>
                        You matched&nbsp;
                        <MatchAccent>{isLoadingTicketInfo ? '..' : winMatches}</MatchAccent>&nbsp;
                        {pluralPipe(winMatches, 'ball')}&nbsp;
                        {
                            ticketMatches > 1 ?
                                (
                                    <>in <MatchAccent>{ticketMatches}</MatchAccent> tickets</>
                                ) : <></>
                        }
                    </MatchText> :
                    <></>
            }
        </DrawsBallsStyled>
    );
};

export default DrawsBalls;
