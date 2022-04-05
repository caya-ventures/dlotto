import React from "react";
import { SvgProps } from "./index";

export const SvgArrowDown = ({ width, height, color }: SvgProps) => {
    return (
        <svg width={width} height={height} viewBox={ `0 0 ${width} ${height}` } fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.5 1.97368L9.11958 0.5L5.52408 4.51754L1.84831 0.587719L0.5 2.09649L5.55618 7.5L10.5 1.97368Z" fill={color}/>
        </svg>
    );
}

export default SvgArrowDown;
