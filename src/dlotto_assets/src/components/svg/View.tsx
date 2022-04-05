import React from "react";
import { SvgProps } from "./index";

export const SvgView = ({ width, height, color }: SvgProps) => {
    return (
        <svg width={width} height={height} viewBox={ `0 0 ${width} ${height}` } fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.66667 2.5V3.83333H1.33333V11.1667H8.66667V7.83333H10V11.8333C10 12.0101 9.92976 12.1797 9.80474 12.3047C9.67971 12.4298 9.51014 12.5 9.33333 12.5H0.666667C0.489856 12.5 0.320286 12.4298 0.195262 12.3047C0.0702379 12.1797 0 12.0101 0 11.8333V3.16667C0 2.98986 0.0702379 2.82029 0.195262 2.69526C0.320286 2.57024 0.489856 2.5 0.666667 2.5H4.66667ZM12 0.5V5.83333H10.6667V2.77533L5.47133 7.97133L4.52867 7.02867L9.72333 1.83333H6.66667V0.5H12Z" fill={color}/>
        </svg>
    );
}

export default SvgView;
