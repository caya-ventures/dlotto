import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { baseTheme } from '../../../styles/theme';
import { SvgArrowDown, SvgArrowTop } from '../../svg';
import { TICKET_PRICE } from '../../../config';
import { roundPrice } from '../../../utils';
import { AppContext } from '../../../context';

const Wrapper = styled.div`
  background: ${baseTheme.colors.textGrey};
  border-radius: .25rem;
`;

const WrapperLine = styled.div`
  display: flex;
  justify-content: space-between;
  padding: .5rem;
`;

const Text = styled.span`
  color: ${baseTheme.colors.textLightGrey};
  font-size: .75rem;
`;

const TextPrice = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  user-select: none;
`;

const GenerateButton = styled.button`
  height: 2rem;
  width: 6rem;
  line-height: 2rem;
  background: ${ baseTheme.colors.textColor };
  border-top-right-radius: .25rem;
  border-bottom-right-radius: .25rem;
  border: 0;
  font-size: 1rem;
  padding: 0 .75rem;
  cursor: pointer;
  user-select: none;
  
  &:hover {
    background: ${ baseTheme.colors.textLightGrey };
  }
`;

const GenerateInput = styled.span`
  height: 2rem;
  line-height: 2rem;
  display: inline-block;
  background: rgba(29, 29, 29, 0.5);
  border-top-left-radius: .25rem;
  border-bottom-left-radius: .25rem;
  color: ${ baseTheme.colors.textAction };
  font-weight: 700;
  width: 6rem;
  padding: 0 1rem;
  position: relative;
  user-select: none;
`;

const GenerateInputArrow = styled.span`
  cursor: pointer;
  height: 1rem;
  line-height: 1rem;
  width: 2rem;
  text-align: center;
  position: absolute;
  right: 0;

  &.arrow-top {
    top: 0;
  }

  &.arrow-down {
    bottom: 0;
  }
`;

const TicketGenerate = ({ action }: { action: (a: number) => void }) => {

    const MAX_COUNT = 10;
    const MIN_COUNT = 1;
    const [ count, setCount ] = useState(1);
    const { balance } = useContext(AppContext);

    const setCountAction = (value: number, event: React.MouseEvent<Element, MouseEvent>): void => {
        event.preventDefault();
        event.stopPropagation();
        setCount(value < MIN_COUNT ? MIN_COUNT : value >= MAX_COUNT ? MAX_COUNT : value);
    }

    return (
        <Wrapper>
            <WrapperLine>
                <Text>Tickets amount:</Text>
                <Text>Balance: <b>{balance || 0} ICP</b></Text>
            </WrapperLine>
            <WrapperLine>
                <div>
                    <GenerateInput>
                        <span onClick={(e) => setCountAction(count + 1, e)}>{count}</span>
                        <GenerateInputArrow className="arrow-top" onClick={(e) => setCountAction(count + 1, e)}>
                            <SvgArrowTop width={10} height={9} color={baseTheme.colors.textAction}/>
                        </GenerateInputArrow>
                        <GenerateInputArrow className="arrow-down" onClick={(e) => setCountAction(count - 1, e)}>
                            <SvgArrowDown width={11} height={8} color={baseTheme.colors.textAction}/>
                        </GenerateInputArrow>
                    </GenerateInput>
                    <GenerateButton onClick={() => action(count)}>Generate</GenerateButton>
                </div>
                <TextPrice>~{roundPrice(TICKET_PRICE * count)} ICP</TextPrice>
            </WrapperLine>
        </Wrapper>
    );
};

export default TicketGenerate;
