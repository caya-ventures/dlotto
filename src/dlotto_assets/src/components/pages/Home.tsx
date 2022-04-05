import React from 'react';
import { Banner, Draws, HowTo } from "../layout";
import { BannerDisplayMode } from '../layout/banner/Banner';

const Home = () => {

    return (
        <>
            <Banner mode={BannerDisplayMode.BANNER}/>
            <Draws/>
            <HowTo/>
        </>
    );
}

export default Home;
