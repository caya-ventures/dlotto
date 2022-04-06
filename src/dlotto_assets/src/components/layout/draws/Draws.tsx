import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from "styled-components";
import { mainBlockTitle, mainContentWrapper } from "../../../styles/utils";
import { baseTheme } from "../../../styles/theme";
import { SvgArrowDown, SvgArrowTop } from "../../svg";
import DrawsMatches from "./DrawsMatches";
import { dlotto } from '../../../../../declarations/dlotto';
import { useAsync } from 'react-async-hook';
import DrawsBalls from "./DrawsBalls";
import DrawsRounds from "./DrawsRounds";
import { Ticket, UserTicket } from '../../../../../declarations/dlotto/dlotto.did';
import { dateFromBigInt, normalizeTicketList } from "../../../utils";
import DrawsInfo from "./DrawsInfo";
import { Loader } from "../index";
import { useDlottoClient } from "../../../hooks";
import { AppContext, ModalContext } from "../../../context";
import { Modal } from "../modals";
import { TicketGrid } from "../tickets";
import { CSSTransition } from 'react-transition-group';
import { Link } from 'react-router-dom';
import { respondTo } from '../../../styles/helpers';

const DrawsStyled = styled.div`
  padding: 2rem 1rem;
  ${mainContentWrapper};
`;

const DrawsShadow = styled.div`
  box-shadow: 0 0 60px rgba(255, 219, 75, 0.1);
  border-radius: .25rem;
`;

const Title = styled.h2`
  text-align: center;
  ${mainBlockTitle};
`;

const DrawsHeader = styled.div`
  background: ${baseTheme.colors.bgSecondary};
  border-top-left-radius: .25rem;
  border-top-right-radius: .25rem;
  display: flex;
  padding: .5rem 2.5rem;
  justify-content: space-between;
  min-height: 3rem;
  flex-direction: row;

  ${respondTo('md')` flex-direction: column;  padding: .5rem 1rem; `}
`;

const DrawsDate = styled.div`
  line-height: 1.8;

  ${respondTo('md')` margin-top: .5rem; `}
`;

const DrawsContentWrapper = styled.div`
  height: 200px;
  background: url('../../../../assets/svg/block_bg.svg') right top no-repeat;
  background-size: 100% auto;
  
  ${respondTo('md')` height: auto; background-size: auto 100%; `}
`;

const DrawsContent = styled.div`
  height: 200px;
  padding: 0 2.5rem;
  background: url('../../../../assets/draws_bg.png') right top no-repeat;
  background-size: contain;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;

  ${respondTo('md')` flex-direction: column; height: auto; background-size: auto 100%; padding: 0 1rem; `}
`;

const DrawsFooter = styled.div`
  background: ${baseTheme.colors.bgBottom};
  color: ${baseTheme.colors.textAction};
  border-bottom-left-radius: .25rem;
  border-bottom-right-radius: .25rem;
  text-align: center;
  cursor: pointer;
  line-height: 3rem;

  svg {
    margin-left: .5rem;
  }
`;

const DrawsModal = styled.div`
  max-width: 23.5rem;
  width: 100%;

  .action-btn {
    margin-top: 1rem;
    width: 100%;
    display: block;
    text-align: center;
  }
`;

const getAllWinHistory = async () => await dlotto.getAllWinHistory();

const Draws = () => {
    const winHistory = useAsync(getAllWinHistory, []);
    const { isAuthenticated } = useContext(AppContext);
    const { userTicketsModal, setUserTicketsModal } = useContext(ModalContext);
    const { actorDlotto } = useDlottoClient();

    const [ isDetailsActive, setIsDetailsActive ] = useState(false);
    const [ isLoadingTicket, setIsLoadingTicket ] = useState(false);
    const [ currentTicketIndex, setCurrentTicketIndex ] = useState(-1);
    const [ tickets, setTickets ]: [ Ticket[] | [], (a: Ticket[]) => void ] = useState([] as Ticket[]);
    const [ userTickets, setUserTickets ]: [ UserTicket[] | [], (a: UserTicket[]) => void ] = useState([] as UserTicket[]);
    const [ currentTicket, setCurrentTicket ]: [ Ticket | undefined, (a: Ticket) => void ] = useState();

    useEffect(() => {
        if (winHistory.result) {
            const ticketList = normalizeTicketList(winHistory.result);
            if (ticketList.length) {
                setCurrentTicketIndex(ticketList.length - 1);
                setCurrentTicket(ticketList[ticketList.length - 1]);
                setTickets(ticketList);
            }
        }
    }, [ winHistory.result ]);

    useEffect(() => {
        let isMounted = true;
        if (currentTicket?.round && isAuthenticated) {
            setIsLoadingTicket(true);
            actorDlotto?.getUserTicket(currentTicket?.round?.round)
                .then(result => isMounted && setUserTickets('ok' in result ? result.ok : []))
                .finally(() => isMounted && setIsLoadingTicket(false));
        }
        return () => {
            isMounted = false;
        };
    }, [ currentTicket?.round, actorDlotto ]);

    const nextTicket = () => {
        if (isLoadingTicket) return;
        if (currentTicketIndex < tickets?.length - 1) {
            const idx = currentTicketIndex + 1;
            setCurrentTicketIndex(idx);
            setCurrentTicket(tickets[idx]);
        }
    };

    const prevTicket = () => {
        if (isLoadingTicket) return;
        if (currentTicketIndex > 0) {
            const idx = currentTicketIndex - 1;
            setCurrentTicketIndex(idx);
            setCurrentTicket(tickets[idx]);
        }
    };

    const toggleDetails = () => {
        setIsDetailsActive(!isDetailsActive);
    };

    const onClaimAction = () => {
        // TODO: add claim action
        console.log('// TODO: add claim action');
    };

    return (
        <DrawsStyled>
            <Title>Finished draws</Title>
            <DrawsShadow>
                <DrawsHeader
                    className={!winHistory.loading && !winHistory.result?.length ? 'hide' : ''}>
                    <DrawsRounds currentRound={currentTicket?.round.round}
                                 roundIndex={currentTicketIndex}
                                 roundCount={tickets?.length}
                                 onPrev={prevTicket}
                                 onNext={nextTicket}/>
                    <DrawsDate>
                        {currentTicket?.date_time ? `Drawn on ${dateFromBigInt(currentTicket?.date_time)}` : "Loading..."}
                    </DrawsDate>
                </DrawsHeader>
                <DrawsContentWrapper>
                    <DrawsContent>
                        {
                            currentTicket ?
                                <>
                                    <DrawsInfo prizePot={currentTicket?.round?.prize_pot}
                                               isLoading={isLoadingTicket}
                                               ticketsCount={userTickets?.length || 0}/>
                                    <DrawsBalls ticket={currentTicket}
                                                userTickets={userTickets || []}
                                                isLoadingTicketInfo={isLoadingTicket}/>
                                </> :
                                winHistory.loading ? <Loader/> : 'No finished draws'
                        }
                    </DrawsContent>
                </DrawsContentWrapper>
                <CSSTransition in={isDetailsActive} timeout={300} classNames="fade-and-scale">
                    <DrawsMatches isActive={isDetailsActive} ticket={currentTicket}/>
                </CSSTransition>
                <DrawsFooter
                    className={!winHistory.result?.length ? 'hide' : ''}
                    onClick={toggleDetails}>
                    {
                        isDetailsActive ?
                            <>
                                Hide
                                <SvgArrowTop width={11} height={9} color={baseTheme.colors.textAction}/>
                            </> :
                            <>
                                Details
                                <SvgArrowDown width={11} height={8} color={baseTheme.colors.textAction}/>
                            </>
                    }
                </DrawsFooter>
            </DrawsShadow>
            <Modal title={'Your tickets for round #' + Number(currentTicket?.round?.round)}
                   isVisible={userTicketsModal}>
                <DrawsModal>
                    <TicketGrid userTickets={userTickets || []} hasClaimAction={true} onClaimAction={onClaimAction} currentTicket={currentTicket}/>
                    <Link to={'/buy'} className="btn btn-primary action-btn"
                          onClick={() => setUserTicketsModal(false)}>
                        Buy tickets
                    </Link>
                </DrawsModal>
            </Modal>
        </DrawsStyled>
    );
};

export default Draws;
