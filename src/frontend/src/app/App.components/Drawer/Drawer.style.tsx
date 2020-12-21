import styled from 'styled-components/macro'

import { backgroundColorDark, primaryColor, textColor } from '../../../styles'

export const DrawerMask = styled.div`
  position: fixed;
  z-index: 9;
  top: 0;
  left: 0;
  opacity: 0;
  will-change: opacity;
  transition: opacity 0.2s ease-in-out;

  &.true {
    width: 100vw;
    height: 100vh;
    opacity: 0.5;
    background-color: black;
  }
`

export const DrawerStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 10;
  width: 300px;
  max-width: calc(100vw - 20px);
  padding: 60px 20px 20px 30px;
  background-color: ${backgroundColorDark};
  box-shadow: 1px 7px 14px -5px rgba(0, 0, 0, 0.2);
  transform: translate3d(-300px, 0, 0);
  transition: 0.2s ease-in-out;
  will-change: transform;

  &.true {
    transform: translate3d(0px, 0, 0);
  }

  &.false {
    transform: translate3d(-300px, 0, 0);
  }
`

export const DrawerItem = styled.div<{ isSelected?: boolean }>`
  margin-top: 20px;

  > a {
    display: inline-block;
    font-weight: bold;
    line-height: 24px;
    display: flex;
    color: ${(props) => (props.isSelected ? primaryColor : textColor)} !important;

    > svg {
      display: inline-block;
      width: 24px;
      height: 24px;
      stroke: ${textColor};
      fill: ${textColor};
      margin-right: 20px;
      stroke: ${(props) => (props.isSelected ? primaryColor : textColor)};
    }

    img {
      width: 24px;
      height: 24px;
      margin-right: 20px;
      border-radius: 12px;
    }
  }
`
