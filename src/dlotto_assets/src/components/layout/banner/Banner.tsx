import React from 'react';
import styled, { css } from "styled-components";
import { baseTheme } from "../../../styles/theme";
import BannerBall from "./BannerBall";
import BannerJackPot from "./BannerJackPot";

export enum BannerDisplayMode {
    BANNER,
    PAGE,
}

const mainBannerSize = css`
  height: ${baseTheme.mainBanner.height}px;
  background-size: cover;
`;

const pageBannerSize = css`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const MainBanner = styled.div<{ mode: BannerDisplayMode}>`
  position: relative;
  background: url('../../../../assets/banner/main_bg.jpeg') 0 0 no-repeat;
  ${({ mode }) => mode === BannerDisplayMode.BANNER ? mainBannerSize : pageBannerSize}
`;

const MainBannerRibbons = styled.div<{ mode: BannerDisplayMode}>`
  background: url('../../../../assets/banner/secondary_bg.png') 0 50% no-repeat;
  position: relative;
  z-index: 3;
  ${({ mode }) => mode === BannerDisplayMode.BANNER ? mainBannerSize : pageBannerSize}
  align-items: center;
  justify-content: center;
`;

const MainBannerTicket1 = styled.span`
  background: url('../../../../assets/banner/ticket1.png') 0 0 no-repeat;
  background-size: 100%;
  position: absolute;
  top: 10%;
  left: 65%;
  width: 6.625rem;
  height: 5rem;
  z-index: 1;
`;

const MainBannerTicket2 = styled.span`
  background: url('../../../../assets/banner/ticket2.png') 0 0 no-repeat;
  background-size: 100%;
  position: absolute;
  top: 50%;
  left: 25%;
  width: 10rem;
  height: 6.5rem;
  z-index: 1;
`;

const Banner = ({ mode, children }: {mode: BannerDisplayMode; children?: JSX.Element}) => {

    return (
        <MainBanner mode={mode}>
            <MainBannerTicket1/>
            <MainBannerTicket2/>
            <MainBannerRibbons mode={mode}>
                <BannerBall height={3} width={3} bgImg={'../../../../assets/banner/ball1.png'} top={30} left={20}/>
                <BannerBall height={4.25} width={4.25} bgImg={'../../../../assets/banner/ball2.png'} top={80}
                            left={25}/>
                <BannerBall height={5} width={5} bgImg={'../../../../assets/banner/ball3.png'} top={5} left={30}/>
                <BannerBall height={4.75} width={4.75} bgImg={'../../../../assets/banner/ball4.png'} top={70}
                            left={35}/>
                <BannerBall height={2.25} width={2.25} bgImg={'../../../../assets/banner/ball5.png'} top={7} left={58}/>
                <BannerBall height={2.55} width={5.25} bgImg={'../../../../assets/banner/ball6.png'} bottom={0}
                            left={61}/>
                <BannerBall height={3.75} width={3.75} bgImg={'../../../../assets/banner/ball7.png'} top={40}
                            left={67}/>
                <BannerBall height={3.75} width={3.75} bgImg={'../../../../assets/banner/ball8.png'} top={75}
                            left={72}/>
                <BannerBall height={7} width={7} bgImg={'../../../../assets/banner/ball9.png'} top={0} right={0}/>
                {mode === BannerDisplayMode.BANNER ? <BannerJackPot/> : children}
            </MainBannerRibbons>
        </MainBanner>
    );
};

export default Banner;
