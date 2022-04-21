import React, { useContext, useState } from 'react';
import styled from "styled-components";
import { baseTheme } from '../../../styles/theme';
import { TicketGenerate } from './';
import { AccountIdentifier, Ticket, UserTicket } from '../../../../../declarations/dlotto/dlotto.did';
import TicketGrid from './TicketGrid';
import { pluralPipe, randomNumbersArray, toTickets, toUserTickets } from '../../../utils';
import { AppContext, ModalContext } from '../../../context';
import { Modal } from '../modals';
import TicketEdit from './TicketEdit';
import { useHistory } from 'react-router-dom';
import { SvgCross } from '../../svg';
import toast from 'react-hot-toast';
import { TICKET_PRICE } from '../../../config';
import { TransferError, TransferResult } from '../../../../../declarations/ledger/ledger.did';
import { Principal } from '@dfinity/principal';

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

const BuyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  vertical-align: center;
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
    const { actor, ledger, updateBalance, authClient } = useContext(AppContext);
    const { ticketEditModal, setTicketEditModal } = useContext(ModalContext);
    const history = useHistory();

    const [ userTickets, setUserTickets ] = useState([] as Array<UserTicket>);
    const [ tickets, setTickets ] = useState([] as Array<Ticket>);

    const [ currentTicketId, setCurrentTicketId ] = useState(0 as number);
    const [ isApproving, setIsApproving ] = useState(false as boolean);
    var userPrincipal = authClient?.getIdentity().getPrincipal() as Principal;


    const goBack = () => {
        history.push('/');
    };

    const approveTickets = async () => {
        if (isApproving) return;
        setIsApproving(true);

        const chargeResult = await chargeForTickets(tickets?.length || 0) as TransferResult;

        if ('Err' in chargeResult) {
            toast.error(JSON.stringify(chargeResult.Err as TransferError));
            return;
        }

        updateBalance();
        await actor?.assignTicketToUser(tickets as Ticket[], userPrincipal);

        toast.success(`You have bought ${tickets?.length} ${pluralPipe(tickets?.length, 'ticket')}`);

        setIsApproving(false);
        goBack();
    };

    const chargeForTickets = async (ticketAmount: number): Promise<TransferResult> => {
        const depositAddressBlob = await actor?.getDepositAddress(userPrincipal);
        const amount: bigint = BigInt(ticketAmount * TICKET_PRICE * 100000000);
        const fee: bigint = BigInt(10000);

        // TODO: replace with a more reliable way to charge users
        return ledger?.transfer({
            memo: BigInt(0x1),
            amount: { e8s: amount + fee },
            fee: { e8s: fee},
            to: depositAddressBlob as AccountIdentifier,
            from_subaccount: [],
            created_at_time: [],
        }) as Promise<TransferResult>;
    }

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
            <BuyHeader>
                <BuyTitle>Buy tickets</BuyTitle>
                <button className={"btn btn-transparent btn-ico"} onClick={goBack}>
                    <SvgCross width={12} height={12} color={baseTheme.colors.textAction}/>
                </button>
            </BuyHeader>
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
