import React from "react";
import { SvgProps } from "./index";

export const SvgArrowLeft = ({ width, height, color }: SvgProps) => {
    return (
        <svg width={width} height={height} viewBox={ `0 0 ${width} ${height}` } fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.43159 -8.76374e-07L9.20001 1.6565L4.37896 5.97111L9.09475 10.382L7.28422 12L0.800011 5.93258L7.43159 -8.76374e-07Z" fill={color}/>
        </svg>
    );
}

export default SvgArrowLeft;
