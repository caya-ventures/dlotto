import React, { useState } from 'react';
import { useAsync } from 'react-async-hook';
import { dlotto } from '../../../../declarations/dlotto';

const getWinHistory = async () => await dlotto.getWinHistory(BigInt(93));
// const getUserTicket = async () => await dlotto.generateUserTicket(BigInt(1));
const getUserTicketHistory = async () => await dlotto.getUserTicket(BigInt(9)); 


const getUserBalance = async () => await dlotto.userBalance();
const getUserId = async () => await dlotto.userId();
//
const Test = () => {

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
    //const transferTokens = async () => await dlotto.tranferTokens();
    const [ isTransfering, setIsTransfering ] = useState<boolean>(false);
    // let winningNumbers;
    // if (generateWinningNumbers.result) {
    //     winningNumbers = generateWinningNumbers.result?.map((item, index) => <span key={index.toString()}> {item.toString()} </span>);
    // } else {
    //     winningNumbers = 'Loading ...'
    // }
    // const transfer = () => {
    //     setIsTransfering(true);
    //     transferTokens()
    //     .then(r => console.log(r))
    //         .finally(() => setIsTransfering(false));
    // };

    return (
        <section>
            {/* <div>generateNumber: {generateNumber.result?.toString() || 'Loading ...'}</div> */}
            {/* <div>generateNumbersArray: {generateNumbersArray.result?.toString() || 'Loading ...'}</div> */}
            {/* <div>generateWinningNumbers: {generateWinningNumbers}</div> */}
            {<div>UserBalance: {userBalance.result?.e8s.toString()}</div>}
            {/* {<button className="btn btn-blue btn--large" onClick={transfer} disabled={isTransfering}>
                    {isTransfering ? 'Transfering' : 'Transfer 1 ICP to your balance'}
                </button>} */}
            {<div>UserId: {userId.result}</div>}
        </section>
    );
}

export default Test;
