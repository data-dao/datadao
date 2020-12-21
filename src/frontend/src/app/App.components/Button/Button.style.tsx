import styled, { keyframes } from 'styled-components/macro'

import { backgroundColorLight, textColor } from '../../../styles'

export const clickWave = (color: string) => keyframes`
  from {
    box-shadow: 0 0 0 0 ${color};
  }
  to {
    box-shadow: 0 0 0 5px ${color}00;
  }
`

export const ButtonStyled = styled.button<{ color: string; textColor: string }>`
  height: 36px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  will-change: box-shadow;
  width: 100%;
  user-select: none;
  color: ${(props) => props.textColor};
  background: ${(props) =>
    props.color !== 'transparent' ? 'linear-gradient(to right bottom, #FF3B00, #FE7E00)' : 'transparent'};

  &.clicked {
    animation: ${(props) => clickWave(props.color)} 1250ms cubic-bezier(0.19, 1, 0.22, 1);
    animation-fill-mode: forwards;
  }

  &.loading {
    pointer-events: none;
    opacity: 0.8;
  }

  will-change: transform;
  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    cursor: default;
    background-color: ${backgroundColorLight};
  }

  svg {
    width: 16px;
    height: 16px;
    display: inline-block;
    vertical-align: sub;
    margin-right: 15px;
    stroke: ${(props) => props.textColor};
  }
`

export const ButtonText = styled.div`
  text-align: center;
  margin: auto;
  display: inline-block;
  line-height: 36px;
`

export const ButtonIcon = styled.svg``

const turn = keyframes`
  100% {
      transform: rotate(360deg);
  }
`

const path = keyframes`
  100% {
      stroke-dashoffset: 0;
  }
`

export const ButtonLoadingIcon = styled.svg`
  width: 16px;
  height: 16px;
  margin-right: 15px;
  vertical-align: sub;
  stroke: ${textColor};
  stroke-width: 1px;
  stroke-dashoffset: 94.248;
  stroke-dasharray: 47.124;
  animation: ${turn} 1.6s linear infinite forwards, ${path} 1.6s linear infinite forwards;
`
