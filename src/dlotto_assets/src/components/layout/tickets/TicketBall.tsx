import React from 'react';
import styled from 'styled-components';
import { baseTheme } from '../../../styles/theme';

const TicketWrapper = styled.span`
  width: 2rem;
  height: 2rem;
  padding: 0;
  border-radius: 50%;
  background: linear-gradient(117.11deg, #C2C2C2 15.65%, #FFFFFF 81.74%);
  transform: rotate(-10deg);
  display: inline-flex;
  align-items: center;
  transition: all .5s;
  cursor: pointer;
  margin: 0 .25rem;
  animation: smallBallAppear .4s;

  @keyframes smallBallAppear {
    from {
      opacity: .5;
      width: 1.5rem;
      height: 1.5rem;
    }
    to {
      opacity: 1;
      width: 2rem;
      height: 2rem;
    }
  }

  &.super {
    background-image: url('../../../../assets/super.png');
    background-size: cover;

    &.selected {
      border: 2px solid ${baseTheme.colors.textAction};
    }
  }

  &.selected {
    border: 2px solid ${baseTheme.colors.textOrange};
  }

  &.multiple {
    margin-bottom: .5rem;
  }

  &:hover {
    transform: rotate(10deg);
  }
  
`;

const TicketNumber = styled.span`
  display: block;
  width: 1.2rem;
  height: 1.2rem;
  margin: 0 auto;
  background: #fff;
  border-radius: 50%;
  font-size: .75rem;
  line-height: 1.2rem;
  text-align: center;
  font-weight: 700;
  color: #2F2F2F;
`;

const TicketBall = (
    {
        value,
        isSelected,
        isSuper,
        isMultiple,
        onClick,
    }: Partial<{ value: number | string; isSelected?: boolean; isSuper?: boolean; isMultiple?: boolean; onClick?: () => void }>) => {

    return (
        <TicketWrapper
            className={`${isSuper ? 'super' : ''} ${isMultiple ? 'multiple' : ''} ${isSelected ? 'selected' : ''}`}
            onClick={onClick}>
            <TicketNumber>{value}</TicketNumber>
        </TicketWrapper>
    );
};

export default TicketBall;
