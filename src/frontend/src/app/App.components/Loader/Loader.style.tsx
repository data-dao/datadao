import styled, { keyframes } from 'styled-components'

export const LoaderStyled = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: space-around;
`

const anim = keyframes`
  0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
`

export const LoaderAnim = styled.div`
  display: inline-block;

  > img {
    margin-right: 5px;
    display: inline-block;
    animation-name: ${anim};
    animation-iteration-count: infinite;
    animation-duration: 1s;
    animation-timing-function: ease;
    animation-fill-mode: both;
    backface-visibility: hidden;
    height: 50px;

    &:nth-child(1) {
      animation-delay: 100ms;
    }

    &:nth-child(2) {
      animation-delay: 200ms;
    }

    &:nth-child(3) {
      animation-delay: 300ms;
    }

    &:nth-child(4) {
      animation-delay: 400ms;
    }

    &:nth-child(5) {
      animation-delay: 500ms;
    }

    &:nth-child(6) {
      animation-delay: 600ms;
    }
  }
`
