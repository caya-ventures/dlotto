import React, { useContext } from 'react';
import styled from "styled-components";
import { ModalContext } from "../../../context";
import { baseTheme } from "../../../styles/theme";
import { SvgCross } from "../../svg";

const ModalWrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(.25rem);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContainer = styled.div`
  background: ${baseTheme.colors.bgSecondary};
  border-radius: .25rem;
  padding: 1.25rem;
  position: relative;
  animation-duration: .3s;
  animation-name: slidein;
  animation-timing-function: ease-in-out;
  max-height: 100%;
  overflow: auto;
`;

const ModalContainerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  .btn {
    margin-right: -.5rem;
  }

  @keyframes slidein {
    0% {
      opacity: .1;
      left: -100%;
    }
    80% {
      opacity: .6;
      left: 5%;
    }
    100% {
      opacity: 1;
      left: 0;
    }
  }
`;

const ModalTitle = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
`;

export const Modal = ({ title, isVisible, children }:
                          { title: string; isVisible: boolean; children: JSX.Element; }) => {
    const {
        authModal,
        setAuthModal,
        userTicketsModal,
        setUserTicketsModal,
        ticketEditModal,
        setTicketEditModal,
        currentTicketsModal,
        setCurrentTicketsModal,
    } = useContext(ModalContext);

    if (!isVisible) return null;

    const closeModal = () => {
        if (authModal) {
            return setAuthModal(false);
        }
        if (userTicketsModal) {
            return setUserTicketsModal(false);
        }
        if (ticketEditModal) {
            return setTicketEditModal(false);
        }
        if (currentTicketsModal) {
            return setCurrentTicketsModal(false);
        }
    };

    return (
        <ModalWrapper onClick={closeModal}>
            <ModalContainer onClick={event => event.stopPropagation()}>
                <ModalContainerHeader>
                    <ModalTitle>{title}</ModalTitle>
                    <button className={"btn btn-transparent btn-ico"} onClick={closeModal}>
                        <SvgCross width={12} height={12} color={baseTheme.colors.textAction}/>
                    </button>
                </ModalContainerHeader>
                {
                    children
                }
            </ModalContainer>
        </ModalWrapper>
    );
};

export default Modal;
