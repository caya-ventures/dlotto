import React, { useContext } from 'react';
import styled from "styled-components";
import { baseTheme } from "../../../styles/theme";
import { AppContext, ModalContext } from "../../../context";
import { SvgCopy, SvgView } from "../../svg";
import { CopyToClipboard } from 'react-copy-to-clipboard';

const ModalContent = styled.div`
  background: ${baseTheme.colors.textGrey};
  border-radius: .25rem;
  padding: 1.25rem;
  margin: 1rem 0 0 0;
  max-width: 22.5rem;
  width: 100%;
`;

const Connection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: .75rem;
`;

const Session = styled.div`
  padding: 1rem 0 0 0;

  .btn {
    color: ${baseTheme.colors.textColor};
  }

  .btn + .btn {
    margin-left: 1rem;
  }

  .session-actions {
    padding-top: .5rem;
  }
`;

const ICimg = styled.img`
  height: .75rem;
  margin: 0 .5rem 0 0;
`;

const AuthModal = () => {

    const { logout, profile, balance } = useContext(AppContext);
    const { setAuthModal } = useContext(ModalContext);

    const username = profile?.bio?.username || 'Account';
    const authUrl = process.env.II_URL;

    const onDisconnect = () => {
        setAuthModal(false);
        logout();
    }

    return (
        <ModalContent>
            <Connection>
                <span>Connected to IC</span>
                <button className="btn btn-negative btn--small" onClick={onDisconnect}>Disconnect</button>
            </Connection>
            <Session>
                <ICimg src="assets/ic-badge.svg" alt="Internet Computer"/>
                <span>{username}</span>
                <div>Balance: {balance || 0} ICP</div>
                <div className="session-actions">
                    <CopyToClipboard text={username}>
                        <button className={"btn btn-transparent btn--small btn-with-ico"}>
                            <SvgCopy width={12} height={12} color={baseTheme.colors.textColor}/>
                            Copy Session ID
                        </button>
                    </CopyToClipboard>
                    <a className={"btn btn-transparent btn--small btn-with-ico"} target="_blank" href={authUrl}>
                        <SvgView width={12} height={13} color={baseTheme.colors.textColor}/>
                        View on Explorer
                    </a>
                </div>
            </Session>
        </ModalContent>
    )
}

export default AuthModal;