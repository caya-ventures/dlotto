import { createGlobalStyle } from 'styled-components';
import { baseTheme } from './theme';
import { buttonStyles } from "./buttons";
import { helperStyles } from "./helpers";
import { animationStyles } from './annimations';

export default createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
    padding: 0;
    margin: 0;
    line-height: 1.5;
    background-color: ${baseTheme.colors.bgPrimary};
    color: ${baseTheme.colors.textColor};
  }

  article, aside, details, figcaption, figure,
  footer, header, hgroup, menu, nav, section {
    display: block;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    vertical-align: baseline;
  }
  
  ${buttonStyles};
  ${helperStyles};
  ${animationStyles};
`;
