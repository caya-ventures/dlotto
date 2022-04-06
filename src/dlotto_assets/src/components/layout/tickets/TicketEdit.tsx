import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { baseTheme } from '../../../styles/theme';
import { TicketBall } from './index';
import { Ticket } from '../../../../../declarations/dlotto/dlotto.did';
import { respondTo } from '../../../styles/helpers';

const colStyle = css`
  border-radius: .25rem;
  padding: 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-areas:
    "main super"
    "main select";
  column-gap: 1rem;
  row-gap: 1rem;
  margin-top: 1rem;

  .bottom-gap {
    margin-bottom: .5rem;
  }

  ${respondTo('sm')` display: block; `}
`;

const GridColMain = styled.div`
  grid-area: main;
  ${colStyle};
  background: rgba(68, 68, 68, 0.5);
  width: 12rem;

  ${respondTo('sm')` width: 17rem; `}
`;

const GridColSuper = styled.div`
  grid-area: super;
  ${colStyle};
  background: rgba(68, 68, 68, 0.5);
  width: 14.5rem;
  
  ${respondTo('sm')` width: 17rem; margin: 1rem 0; `}
`;

const GridColSelect = styled.div`
  grid-area: select;
  background: ${baseTheme.colors.textGrey};
  ${colStyle};

  ${respondTo('sm')` width: 17rem; `}
`;

const GridColTitle = styled.p`
  margin: 0 0 .75rem 0;
  font-size: .875rem;
`;

const GridSelected = styled.div`
  padding: 0 0 .5rem 0;
  display: flex;
`;

const EmptyBall = styled.span`
  border: 1px solid #C2C2C2;
  width: 2rem;
  height: 2rem;
  padding: 0;
  border-radius: 50%;
  background: ${baseTheme.colors.bgSecondary};
  transform: rotate(-10deg);
  display: inline-flex;
  margin: 0 .25rem 0.25rem .25rem;

  &.super {
    border: 1px solid ${baseTheme.colors.textOrange};
  }
`;

const Actions = styled.div`
  text-align: center;

  .btn {
    width: 100%;
    text-align: center;
  }
`;

const TicketEdit = ({
                        ticket,
                        onSubmit,
                    }: { ticket: Ticket | undefined; onSubmit: (b: number[], sB: number) => void }) => {
    const ballArray = [ ...Array(24).keys() ];
    const superBallArray = [ ...Array(10).keys() ];

    const [ regularBalls, setRegularBalls ] = useState([] as number[]);
    const [ superBall, setSuperBall ] = useState(0 as number);

    useEffect(() => {
        setRegularBalls(ticket?.regular.map(val => Number(val)) as number[]);
        setSuperBall(Number(ticket?.super[0]));
    }, []);

    const addRegularBall = (val: number) => {
        if (regularBalls.includes(val)) {
            removeRegularBall(val);
        } else if (regularBalls.length >= 4) {
            const arr = [ ...regularBalls ].slice(1, regularBalls.length);
            arr.push(val);
            setRegularBalls(arr as number[]);
        } else {
            setRegularBalls((arr: number[]) => [ ...arr, val ]);
        }
    };

    const removeRegularBall = (val: number) => {
        setRegularBalls(regularBalls.filter(item => item !== val));
    };

    return (
        <Grid>
            <GridColMain>
                <GridColTitle>Choose 4 balls:</GridColTitle>
                {
                    ballArray.map(item => <TicketBall value={item + 1}
                                                      key={item}
                                                      onClick={() => addRegularBall(item + 1)}
                                                      isSelected={regularBalls?.includes(item + 1)}
                                                      isMultiple={true}/>)
                }
            </GridColMain>
            <GridColSuper>
                <GridColTitle>Choose super ball:</GridColTitle>
                {
                    superBallArray.map(item => <TicketBall value={item + 1}
                                                           key={item}
                                                           isSuper={true}
                                                           isSelected={item + 1 === superBall}
                                                           onClick={() => setSuperBall(superBall === item + 1 ? 0 : item + 1)}
                                                           isMultiple={true}/>)
                }

            </GridColSuper>
            <GridColSelect>
                <GridColTitle><b>Selected:</b></GridColTitle>
                <GridSelected>
                    {
                        regularBalls.map(item => <TicketBall value={Number(item)}
                                                             key={Number(item)}
                                                             onClick={() => removeRegularBall(item)}
                                                             isMultiple={true}/>)

                    }
                    {
                        [ ...Array(4 - regularBalls?.length).keys() ].map(item => <EmptyBall key={item}/>)
                    }
                    {
                        superBall ?
                            [ superBall ].map(item => <TicketBall onClick={() => setSuperBall(0)}
                                                                  key={Number(item)}
                                                                  value={item.toString()} isSuper={true}
                                                                  isMultiple={true}/>)
                            :
                            <EmptyBall className={"super"}/>
                    }
                </GridSelected>
                <Actions>
                    <button className={'btn btn-primary'} disabled={!superBall || regularBalls.length !== 4}
                            onClick={() => onSubmit(regularBalls, superBall)}>
                        Done
                    </button>
                </Actions>
            </GridColSelect>
        </Grid>
    );
};

export default TicketEdit;
