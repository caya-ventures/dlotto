import { useState } from "react";

export function useModalClient() {

    const [ authModal, setAuthModal ] = useState(false);
    const [ userTicketsModal, setUserTicketsModal ] = useState(false);
    const [ currentTicketsModal, setCurrentTicketsModal ] = useState(false);
    const [ ticketEditModal, setTicketEditModal ] = useState(false);

    return {
        authModal,
        setAuthModal,
        userTicketsModal,
        setUserTicketsModal,
        ticketEditModal,
        setTicketEditModal,
        currentTicketsModal,
        setCurrentTicketsModal,
    }
}
