import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Ticket, UserTicket } from "../../../../../declarations/dlotto/dlotto.did";
import { baseTheme } from "../../../styles/theme";
import { TicketBall } from './';
import { matchUserTickets } from '../../../utils';

const TicketItems = styled.div`
  margin: .5rem 0;
  max-height: 20rem;
  overflow: auto;
`;

const TicketItem = styled.div`
  background: ${baseTheme.colors.textGrey};
  border-radius: .25rem;
  margin-top: .5rem;
  color: ${baseTheme.colors.textLightGrey};
  display: flex;
  align-items: center;
  padding: .3rem 0;

  .btn {
    height: 2rem;
    line-height: 2rem;
    padding: 0 1rem;
    margin: 0 1rem;
  }
`;

const TicketList = styled.div`
  flex-grow: 1;
  text-align: center;
`;

const TicketId = styled.span`
  padding: 0 1rem;
  font-size: .875rem;
  min-width: 3rem;

  &.winning {
    font-weight: 700;
    color: ${baseTheme.colors.textAction};
  }
`;

const NoTickets = styled.div`
  min-height: 6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${baseTheme.colors.textLightGrey};
  font-size: .875rem;
`;

const ClaimAction = styled.div`
  width: 7rem;
`;

const TicketGrid = ({ userTickets, hasEditAction, onEditAction, hasClaimAction, onClaimAction, currentTicket }: {
    userTickets: UserTicket[];
    hasEditAction?: boolean;
    onEditAction?: (a: number) => void;
    hasClaimAction?: boolean;
    onClaimAction?: (a: number) => void;
    currentTicket?: Ticket | undefined;
}) => {

    const [ winTickets, setWinTickets ] = useState([] as BigInt[]);

    useEffect(() => {
        if (currentTicket && userTickets) {
            const { ticketIds } = matchUserTickets(userTickets, currentTicket);
            setWinTickets(ticketIds);

        }
    }, [ userTickets, currentTicket ]);

    const ticketItems = userTickets.map(item =>
        <TicketItem key={Number(item.ticket_id)}>
            <TicketId className={`${winTickets?.includes(item.ticket_id) ? 'winning' : ''}`}>
                #{Number(item.ticket_id)}
            </TicketId>
            <TicketList>
                {
                    item.ticket.regular.map(ticket => <TicketBall key={Number(ticket)} value={Number(ticket)}
                                                                  isSelected={currentTicket?.regular.includes(ticket)}/>)
                }
                {
                    item.ticket.super.map(ticket => <TicketBall key={Number(ticket)} value={Number(ticket)}
                                                                isSuper={true}
                                                                isSelected={currentTicket?.super[0] === ticket}/>)
                }
            </TicketList>
            {
                hasEditAction ? <button className="btn btn-primary"
                                        onClick={() => onEditAction?.(Number(item.ticket_id) - 1)}>Edit</button> : <></>
            }
            {
                hasClaimAction ? <ClaimAction>
                    {
                        winTickets.includes(item.ticket_id) ?
                            <button className="btn btn-primary"
                                    onClick={() => onClaimAction?.(Number(item.ticket_id) - 1)}>Claim</button> : <></>
                    }
                </ClaimAction> : <></>


            }
        </TicketItem>,
    );

    return (
        <TicketItems>
            {
                userTickets.length ?
                    ticketItems :
                    <NoTickets>
                        <span>No tickets in this round</span>
                    </NoTickets>
            }
        </TicketItems>
    );
};

export default TicketGrid;
