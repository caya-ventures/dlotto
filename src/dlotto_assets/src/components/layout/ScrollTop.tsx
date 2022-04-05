import React from 'react';
import { baseTheme } from "../../styles/theme";
import { SvgArrowTop } from "../svg";

const ScrollTop = () => {

    const scrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <button className="btn btn-ico btn-primary" onClick={scrollTop}>
            <SvgArrowTop width={10} height={10} color={baseTheme.colors.bgSecondary}/>
        </button>
    );
}

export default ScrollTop;
