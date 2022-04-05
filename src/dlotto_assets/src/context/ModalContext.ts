import * as React from 'react';

export const ModalContext = React.createContext<{
    authModal: boolean;
    setAuthModal: (a: boolean) => void;
    userTicketsModal: boolean;
    setUserTicketsModal: (a: boolean) => void;
    ticketEditModal: boolean;
    setTicketEditModal: (a: boolean) => void;
    currentTicketsModal: boolean;
    setCurrentTicketsModal: (a: boolean) => void;
}>({
    authModal: false,
    setAuthModal: () => {},
    userTicketsModal: false,
    setUserTicketsModal: () => {},
    ticketEditModal: false,
    setTicketEditModal: () => {},
    currentTicketsModal: false,
    setCurrentTicketsModal: () => {},
});

export default ModalContext;
