import React from "react";
import { SvgProps } from "./index";

export const SvgArrowRight = ({ width, height, color }: SvgProps) => {
    return (
        <svg width={width} height={height} viewBox={ `0 0 ${width} ${height}` } fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.56842 -8.76374e-07L0.800004 1.6565L5.62106 5.97111L0.905266 10.382L2.71579 12L9.2 5.93258L2.56842 -8.76374e-07Z" fill={color}/>
        </svg>
    );
}

export default SvgArrowRight;
