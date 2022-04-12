import React, { useContext, useState } from 'react';
import { useAsync } from 'react-async-hook';
import { AppContext } from "../../context";
import { dlotto } from '../../../../declarations/dlotto';
import { AccountIdentifier } from '../../../../declarations/dlotto/dlotto.did';
import { canisterId, createActor } from '../../../../declarations/ledger';
import { useLedgerClient } from '../../hooks';
import { Principal } from '@dfinity/principal';

const getWinHistory = async () => await dlotto.getWinHistory(BigInt(93));
// const getUserTicket = async () => await dlotto.generateUserTicket(BigInt(1));
const getUserTicketHistory = async () => await dlotto.getUserTicket(BigInt(9)); 


const getUserBalance = async () => await dlotto.userBalance();
const getUserId = async () => await dlotto.userId();


const Test = () => {
    const { actorLedger } = useLedgerClient();
    const { authClient } = useContext(AppContext);
    // const generateNumber = useAsync(getNumber, []);
    const getWinTicketHistory = useAsync(getWinHistory, []);
    // const generateUserTicket = useAsync(getUserTicket, []);
    const receiveUserTicketHistory = useAsync(getUserTicketHistory, []);

    // console.log(generateUserTicket.result);
    // console.log(getWinTicketHistory);
    // console.log(receiveUserTicketHistory);

    console.log(receiveUserTicketHistory);
    
    let userBalance = useAsync(getUserBalance, []);
    let userId = useAsync(getUserId, []);
    let amount: bigint = BigInt(555555);
    let fee: bigint = BigInt(10000);
    let getDepositAddress = async () => await dlotto.canisterAccount();
    
    let depositAddressBlob = useAsync(getDepositAddress, []).result as AccountIdentifier;
    if(depositAddressBlob !== undefined) {
        console.log(toHexString(depositAddressBlob));
    }
    let principal = authClient?.getIdentity().getPrincipal() as Principal;
    console.log(principal);
    let getAccountId = async () => await dlotto.userAccountIdPublic(principal);
    const res = async () => await actorLedger?.transfer({
        memo: BigInt(0x1),
        amount: { e8s: amount },
        fee: { e8s: fee},
        to: depositAddressBlob,
        from_subaccount: [],
        created_at_time: [],
    });
    
    getAccountId().then(
        a => actorLedger?.account_balance(
            { 'account': a}
            ).then(
                b => console.log(b,a)
                )
        );
    const transferTokens = async () => await dlotto.chargeICP(principal);
    const [ isTransfering, setIsTransfering ] = useState<boolean>(false);
    // let winningNumbers;
    // if (generateWinningNumbers.result) {
    //     winningNumbers = generateWinningNumbers.result?.map((item, index) => <span key={index.toString()}> {item.toString()} </span>);
    // } else {
    //     winningNumbers = 'Loading ...'
    // }
    const charge = () => {
        setIsTransfering(true);
        res()
        .then(r => console.log(r))
            .finally(() => setIsTransfering(false));
    };
    const topup = () => {
        setIsTransfering(true);
        transferTokens()
        .then(r => console.log(r))
            .finally(() => setIsTransfering(false));
    };

    return (
        <section>
            {/* <div>generateNumber: {generateNumber.result?.toString() || 'Loading ...'}</div> */}
            {/* <div>generateNumbersArray: {generateNumbersArray.result?.toString() || 'Loading ...'}</div> */}
            {/* <div>generateWinningNumbers: {generateWinningNumbers}</div> */}
            {<div>UserBalance: {userBalance.result?.e8s.toString()}</div>}
            {<button className="btn btn-blue btn--large" onClick={charge} disabled={isTransfering}>
                    {isTransfering ? 'Charge' : 'Charge 1 ICP to your balance'}
                </button>}
                {<button className="btn btn-blue btn--large" onClick={topup} disabled={isTransfering}>
                    {isTransfering ? 'Top up' : 'Top up 1 ICP to your balance'}
                </button>}
            {<div>UserId: {userId.result}</div>}
        </section>
    );
}

export const toHexString = (byteArray: any) => {
    return Array.from(byteArray, function(byte: any) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('').toUpperCase();
};

export default Test;
