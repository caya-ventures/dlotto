import React from 'react';
import styled from "styled-components";
import { baseTheme } from "../../../styles/theme";
import { SvgArrowRight, SvgArrowLeft } from "../../svg";

const DrawsRoundsStyled = styled.div`
  display: flex;
`;

const RoundTitle = styled.h3`
  line-height: 2rem;
  margin: 0 1rem 0 0;
  font-weight: 700;
  font-size: 1.25rem;
`;

const RoundCurrent = styled.span`
  display: inline-block;
  margin: 0 .5rem;
  height: 2rem;
  border-radius: .25rem;
  border: 2px solid ${baseTheme.colors.textAction};
  width: 7rem;
  text-align: center;
  line-height: 1.8;
`;

const DrawsRounds = ({ currentRound, roundCount, roundIndex, onPrev, onNext }: {
    currentRound: bigint | undefined;
    roundCount: number;
    roundIndex: number;
    onPrev: () => void;
    onNext: () => void;
}) => {

    if (!currentRound) {
        return null;
    }

    return (
        <DrawsRoundsStyled>
            <RoundTitle>Round</RoundTitle>
            <button className="btn btn-ico btn-primary" onClick={onPrev} disabled={roundIndex === 0}
                    title={"Previous"}>
                <SvgArrowLeft width={10} height={12} color={baseTheme.colors.bgSecondary}/>
            </button>
            <RoundCurrent>{Number(currentRound)}</RoundCurrent>
            <button className="btn btn-ico btn-primary" onClick={onNext}
                    disabled={roundIndex + 1 === roundCount} title={"Next"}>
                <SvgArrowRight width={10} height={12} color={baseTheme.colors.bgSecondary}/>
            </button>
        </DrawsRoundsStyled>
    );
};

export default DrawsRounds;
