import styled from 'styled-components/macro'
import { backgroundColorDark, borderColor, textColor, backgroundTextColor } from 'styles'

export const ModalStyled = styled.div<{ showing: boolean }>`
  position: fixed;
  z-index: 11;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  transition: opacity 0.2s ease-in-out;
  opacity: ${(props) => (props.showing ? 1 : 0)};
  will-change: opacity;
  display: ${(props) => (props.showing ? 'initial' : 'none')};
`

export const ModalMask = styled.div<{ showing: boolean }>`
  width: 100%;
  height: 100%;
  background-color: black;
  opacity: 0.6;
`

export const ModalCard = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

export const ModalCardContent = styled.div<{ width?: number; height?: number }>`
  background: ${backgroundColorDark};
  border: 1px solid ${borderColor};
  min-height: ${(props) => (props.height ? `${props.height}vh` : 'initial')};
  max-height: calc(90vh - 50px);
  min-width: ${(props) => (props.width ? `${props.width}vw` : 'initial')};
  max-width: 90vw;
  padding: 30px;
`

export const ModalCardText = styled.div`
  color: ${backgroundTextColor};
`

export const ModalCardH1 = styled.h1`
  margin: 0 0 20px 0;
`

export const ModalA = styled.a`
  text-decoration: underline !important;
`

export const ModalClose = styled.div`
  position: absolute;
  top: 0;
  right: -40px;
  cursor: pointer;

  > svg {
    height: 24px;
    width: 24px;
    stroke: ${textColor};
  }
`
