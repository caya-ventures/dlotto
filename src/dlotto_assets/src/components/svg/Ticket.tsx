import React from "react";
import { SvgProps } from "./index";

export const SvgTicket = ({ width, height, color }: SvgProps) => {
    return (
        <svg width={width} height={height} viewBox={ `0 0 ${width} ${height}` } fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 13.3334L1.66666 15.0001C2.58704 14.0797 4.07957 14.0797 4.99995 15.0001C5.92049 15.9206 5.92032 17.413 4.99995 18.3333L6.66661 20L16 10.6666L9.33341 4.00007L0 13.3334ZM10.0001 3.33333L16.6666 9.99989L19.9999 6.66661L18.3333 4.99995C17.4127 5.92049 15.9203 5.92049 15 4.99995C14.0796 4.07957 14.0796 2.58704 15 1.66666L13.3333 0L10.0001 3.33333ZM6.50006 8.83317L8.67723 9.76028L10.4897 8.15612L10.2345 10.5363L12.2762 11.7239L9.93762 12.2707L9.3908 14.6093L8.20324 12.5676L5.82303 12.8228L7.42719 11.0103L6.50006 8.83317Z" fill={color}/>
        </svg>
    );
}

export default SvgTicket;
