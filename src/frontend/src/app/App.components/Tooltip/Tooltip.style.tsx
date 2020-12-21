import styled from 'styled-components/macro'
import { backgroundColorDark } from 'styles'

export const TooltipStyled = styled.div`
  display: inline-block;
  position: relative;
`

export const TooltipMessage = styled.div`
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translate(-50%, 0);
  padding: 10px;
  background-color: ${backgroundColorDark};
  font-size: 14px;
  font-weight: normal;
  width: 500px;
  max-width: 90vw;
  z-index: 100;

  ::before {
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    top: -8px;
    left: 50%;
    margin-left: -10px;

    content: '';
    width: 0;
    height: 0;
    position: absolute;
  }

  ::after {
    border-bottom-color: ${backgroundColorDark};
    border-bottom-style: solid;
    border-bottom-width: 6px;

    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    top: -6px;
    left: 50%;
    margin-left: -8px;

    content: '';
    width: 0;
    height: 0;
    position: absolute;
  }
`
