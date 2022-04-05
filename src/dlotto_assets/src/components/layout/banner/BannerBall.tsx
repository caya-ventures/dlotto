import React from "react";
import styled from "styled-components";

interface BallProps {
    width: number;
    height: number;
    bgImg: string;
    top?: number | string;
    left?: number | string;
    bottom?: number | string;
    right?: number | string;
    isHidden?: boolean;
}

const Ball = styled.span<BallProps>`
  position: absolute;
  height: ${({ height }) => height}rem;
  width: ${({ width }) => width}rem;
  top: ${({ top }) => top !== 'undefined' ? top + '%' : 'auto'};
  bottom: ${({ bottom }) => bottom !== 'undefined' ? bottom + '%' : 'auto'};
  left: ${({ left }) => left !== 'undefined' ? left + '%' : 'auto'};
  right: ${({ right }) => right !== 'undefined' ? right + '%' : 'auto'};
  background: url('${({ bgImg }) => bgImg}') 0 0 no-repeat;
  background-size: contain;
  z-index: 3;
`;

const BannerBall = (props: BallProps) => {
    const { isHidden } = props;

    if (isHidden) return null;

    return (
        <Ball {...props} />
    );
};

export default BannerBall;
