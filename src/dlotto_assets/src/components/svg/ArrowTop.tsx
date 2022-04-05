import React from "react";
import { SvgProps } from "./index";

export const SvgArrowTop = ({ width, height, color }: SvgProps) => {
    return (
        <svg width={width} height={height} viewBox={ `0 0 ${width} ${height}` } fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 6.02632L8.61958 7.5L5.02408 3.48246L1.34831 7.41228L0 5.90351L5.05618 0.5L10 6.02632Z" fill={color}/>
        </svg>
    );
}

export default SvgArrowTop;
