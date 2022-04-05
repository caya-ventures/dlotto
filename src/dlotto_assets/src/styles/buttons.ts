import { baseTheme } from './theme';
import { css } from "styled-components";

export const buttonStyles = css`
  .btn {
    height: ${baseTheme.buttonSize.medium.height};
    line-height: ${baseTheme.buttonSize.medium.lineHeight};
    padding: .5rem ${baseTheme.buttonSize.medium.padding};
    font-size: ${baseTheme.buttonSize.medium.fontSize};
    font-weight: ${baseTheme.buttonSize.medium.fontWeight};
    border: 0;
    outline: none;
    border-radius: .25rem;
    color: ${baseTheme.buttonColor.white.textColor};
    background: ${baseTheme.buttonColor.white.color};
    text-decoration: none;
    transition: all .3s;
    cursor: pointer;
    display: inline-block;
    user-select: none;
    
    &:hover {
      background: ${baseTheme.buttonColor.white.hoverColor};
    }
    
    &:disabled {
      cursor: not-allowed;
      opacity: 30%;
    }

    // Button purpose
    &-primary {
      color: ${baseTheme.buttonColor.primary.textColor};
      background: ${baseTheme.buttonColor.primary.color};

      &:hover {
        background: ${baseTheme.buttonColor.primary.hoverColor};
      }
    }

    &-negative {
      color: ${baseTheme.buttonColor.negative.textColor};
      background: ${baseTheme.buttonColor.negative.color};

      &:hover {
        background: ${baseTheme.buttonColor.negative.hoverColor};
      }
    }

    &-blue {
      color: ${baseTheme.buttonColor.blue.textColor};
      background: ${baseTheme.buttonColor.blue.color};

      &:hover {
        background: ${baseTheme.buttonColor.blue.hoverColor};
      }
    }
    
    &-transparent {
      background: none;

      &:hover {
        background: none;
      }
    }

    // Button size
    &--large {
      height: ${baseTheme.buttonSize.large.height};
      line-height: ${baseTheme.buttonSize.large.lineHeight};
      padding: .5rem ${baseTheme.buttonSize.large.padding};
      font-size: ${baseTheme.buttonSize.large.fontSize};
      font-weight: ${baseTheme.buttonSize.large.fontWeight};
    }
    
    &--small {
      height: ${baseTheme.buttonSize.small.height};
      line-height: ${baseTheme.buttonSize.small.lineHeight};
      padding: 0 ${baseTheme.buttonSize.small.padding};
      font-size: ${baseTheme.buttonSize.small.fontSize};
      font-weight: ${baseTheme.buttonSize.small.fontWeight};
    }

    // Button icon
    &-ico {
      height: 2rem;
      width: 2rem;
      line-height: 1;
      padding: 0;
      text-align: center;
    }
    
    &-with-ico {
      height: 2rem;
      line-height: 1;
      padding: 0;
      text-align: center;

      svg {
        margin: 0 .5rem 0 0;
        position: relative;
        top: 1px;
      }
    }
  }
`;
