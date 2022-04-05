import React, { SetStateAction, useCallback, useContext, useState } from 'react';
import styled from "styled-components";
import { baseTheme } from '../../../styles/theme';
import { TicketGenerate } from './';
import { Ticket, UserTicket } from '../../../../../declarations/dlotto/dlotto.did';
import TicketGrid from './TicketGrid';
import { randomNumbersArray, toTickets, toUserTickets } from '../../../utils';
import { useDlottoClient } from '../../../hooks';
import { ModalContext } from '../../../context';
import { Modal } from '../modals';
import TicketEdit from './TicketEdit';
import { useHistory } from 'react-router-dom';

const BuyWrapper = styled.div`
  max-width: 32rem;
  width: 100%;
  background: ${baseTheme.colors.bgSecondary};
  border-radius: .25rem;
  padding: 2rem;
  z-index: 100;

  .action-btn {
    margin-top: 1rem;
    width: 100%;
    display: block;
    text-align: center;
  }
`;

const BuyTitle = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
`;

const ActionTitle = styled.p`
  font-weight: 700;
  margin-bottom: 0;
`;

const TicketBuy = () => {
    const { actorDlotto } = useDlottoClient();
    const { ticketEditModal, setTicketEditModal } = useContext(ModalContext);
    const history = useHistory();

    const [ userTickets, setUserTickets ] = useState([] as Array<UserTicket>);
    const [ tickets, setTickets ] = useState([] as Array<Ticket>);

    const [ currentTicketId, setCurrentTicketId ] = useState(0 as number);
    const [ isApproving, setIsApproving ] = useState(false as boolean);


    const approveTickets = () => {
        if (isApproving) return;
        setIsApproving(true);
        actorDlotto?.assignTicketToUser(tickets as Ticket[])
            .then(() => {
                // TODO: update balance, update tickets
            })
            .finally(() => {
                setIsApproving(false);
                history.push('/');
            });
    };

    const generateTickets = (count: number) => {
        const numbers = randomNumbersArray(count);
        const numberTickets = toTickets(numbers);
        setTickets(numberTickets as Ticket[]);
        setUserTickets(toUserTickets(numberTickets) as UserTicket[]);
    };

    const onEditAction = (index: number) => {
        if (isApproving) return;
        setCurrentTicketId(index);
        setTicketEditModal(true);
    };

    const onTicketEdited = (balls: number[], superBall: number) => {
        setTicketEditModal(false);
        const numberTickets = toTickets([ [ ...balls, superBall ] ]);
        const updatedTickets = [ ...tickets ];
        updatedTickets[currentTicketId as number] = numberTickets[0];
        setTickets(updatedTickets as Ticket[]);
        setUserTickets(toUserTickets(updatedTickets) as UserTicket[]);
    };

    return (
        <BuyWrapper>
            <BuyTitle>Buy tickets</BuyTitle>
            <p>Numbers are randomized, with no duplicates among your tickets. You are able to edit numbers before the
                Purchase.</p>
            <TicketGenerate action={generateTickets}/>
            {
                userTickets.length ? <>
                        <ActionTitle>Generated tickets:</ActionTitle>
                        <TicketGrid userTickets={userTickets as UserTicket[]}
                                    onEditAction={onEditAction}
                                    hasEditAction={true}/>
                        <button className="btn btn-primary action-btn" disabled={isApproving as boolean}
                                onClick={approveTickets}>
                            {isApproving ? 'Approving...' : 'Approve'}
                        </button>
                    </>
                    : <></>
            }
            <Modal title={`Your ticket #00${Number(currentTicketId) + 1}`} isVisible={ticketEditModal}>
                <>
                    <TicketEdit ticket={tickets[Number(currentTicketId)]} onSubmit={onTicketEdited}/>
                </>
            </Modal>
        </BuyWrapper>
    );
};

export default TicketBuy;
