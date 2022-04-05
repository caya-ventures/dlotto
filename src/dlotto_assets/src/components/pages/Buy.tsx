import React, { useContext } from 'react';
import { Banner } from "../layout";
import { BannerDisplayMode } from '../layout/banner/Banner';
import TicketBuy from '../layout/tickets/TicketBuy';
import { AppContext } from '../../context';
import { Login } from './index';

const BuyPage = () => {
    const { isAuthenticated } = useContext(AppContext);

    return (
            isAuthenticated ?
                <Banner mode={BannerDisplayMode.PAGE}>
                    <TicketBuy/>
                </Banner> :
                <Login/>
    );
}

export default BuyPage;
