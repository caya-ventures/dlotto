import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { baseTheme } from "../../../styles/theme";
import SvgTicket from "../../svg/Ticket";
import { Link } from 'react-router-dom';
import { useAsync } from 'react-async-hook';
import { dlotto } from '../../../../../declarations/dlotto';
import { TICKET_PRICE } from '../../../config';
import { Modal } from '../modals';
import { TicketGrid } from '../tickets';
import { AppContext, ModalContext } from '../../../context';
import { UserTicket } from '../../../../../declarations/dlotto/dlotto.did';
import { Loader } from '../index';

const Jackpot = styled.div`
  max-width: ${baseTheme.mainBanner.potWidth}px;
  width: 100%;
  text-align: center;
  padding: 1rem;
  margin: 0 auto;
  position: relative;
  z-index: 101;
`;

const JackpotTitle = styled.h1`
  color: ${baseTheme.colors.bgSecondary};
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
`;

const JackpotICP = styled.span`
  color: ${baseTheme.colors.bgSecondary};
  font-size: 3rem;
  display: block;
  font-weight: 700;
`;

const JackpotPrice = styled.span`
  color: ${baseTheme.colors.textGrey};
  font-size: 1.25rem;
  display: block;
  font-weight: 400;
`;

const JackpotAction = styled.div`
  background: url('../../../../assets/banner/ticket3.png') 0 0 no-repeat;
  background-size: 100%;
  padding: 0;
  margin: 0;

  svg {
    margin-right: .5rem;
    position: relative;
    top: .25rem
  }
`;

const JackpotTicketPrice = styled.span`
  display: block;
  color: ${baseTheme.colors.bgPrimary};
  font-weight: bold;
  font-size: 1.5rem;
  text-align: center;
  padding: 2.75rem 0 1rem 0;
  transform: rotate(5deg);
  position: relative;
  left: -1.5rem;
`;

const JackpotModal = styled.div`
  max-width: 23.5rem;
  width: 100%;

  .action-btn {
    margin-top: 1rem;
    width: 100%;
    display: block;
    text-align: center;
  }
`;

const CurrentTickets = styled.span`
  display: block;
  height: 1.5rem;
  line-height: 1;
  color: ${baseTheme.colors.bgPrimary};
  font-weight: bold;
  text-align: center;
  opacity: 0;
  transition: all .2s;
  cursor: pointer;
  margin: 1.5rem auto 0 auto;
  width: 10rem;

  &.show {
    opacity: 1;
  }
`;

const getCurrentRound = async () => await dlotto.getCurrentRound();

const BannerJackPot = () => {

    const { isAuthenticated, actor } = useContext(AppContext);
    const { currentTicketsModal, setCurrentTicketsModal } = useContext(ModalContext);
    const currentRound = useAsync(getCurrentRound, []).result;
    const [ userTickets, setUserTickets ]: [ UserTicket[] | [], (a: UserTicket[]) => void ] = useState([] as UserTicket[]);
    const [ isLoadingTicket, setIsLoadingTicket ] = useState(false);

    useEffect(() => {
        let isMounted = true;
        if (currentRound?.round && isAuthenticated) {
            setIsLoadingTicket(true);
            actor?.getUserTicket(currentRound?.round)
                .then(result => isMounted && setUserTickets('ok' in result ? result.ok : []))
                .finally(() => isMounted && setIsLoadingTicket(false));
        }
        return () => {
            isMounted = false;
        };
    }, [ currentRound?.round, actor ]);

    const onViewTickets = () => {
        if (!currentRound) return;
        setCurrentTicketsModal(true);
    };

    return (
        <Jackpot>
            <JackpotTitle>Jackpot</JackpotTitle>
            <JackpotICP>
                {currentRound ? currentRound?.prize_pot.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '..'} ICP
            </JackpotICP>
            {/*<JackpotPrice>*/}
            {/*    $ {price.toLocaleString(undefined, { maximumFractionDigits: 2 })}*/}
            {/*</JackpotPrice>*/}
            <JackpotAction>
                <JackpotTicketPrice>
                    {TICKET_PRICE.toLocaleString(undefined, { maximumFractionDigits: 2 })} ICP
                </JackpotTicketPrice>
                <Link className="btn btn-blue btn--large" to={'/buy'}>
                    <SvgTicket width={20} height={20} color={baseTheme.colors.textColor}/>
                    Buy tickets
                </Link>
            </JackpotAction>
            {
                isAuthenticated ?
                    <CurrentTickets onClick={onViewTickets} className={`${currentRound ? 'show' : ''}`}>View my
                        tickets</CurrentTickets>
                    : <></>
            }
            <Modal title={'Your tickets in current round'}
                   isVisible={currentTicketsModal}>
                <JackpotModal>
                    {
                        isLoadingTicket ? <Loader/> :
                            <>
                                <TicketGrid userTickets={userTickets || []}/>
                                <Link to={'/buy'} className="btn btn-primary action-btn"
                                      onClick={() => setCurrentTicketsModal(false)}>
                                    Buy tickets
                                </Link>
                            </>
                    }
                </JackpotModal>
            </Modal>

        </Jackpot>
    );
};

export default BannerJackPot;
