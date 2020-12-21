import styled from 'styled-components/macro'

import { fadeIn, fadeInFromBottom, fadeInFromLeft, fadeInFromRight, fadeInFromTop } from './animations'
import { backgroundColorLight, primaryColor, upColor } from './colors'

export const Ellipsis = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

export const CardPage = styled.div`
  margin: 100px auto 20px auto;
  width: 400px;
  max-width: 90vw;
`

export const FullPage = styled.div`
  width: 90vw;
  max-width: 1080px;
  margin: 90px auto 20px auto;
`

export const BannerPage = styled.div`
  width: 100vw;
  margin: 100px auto 20px auto;
`

export const Inline = styled.div`
  display: inline-block;
`

export const GridTitle = styled.div`
  display: grid;
  grid-template-columns: auto 150px;

  > h1 {
    margin: 0 0 10px 0;
    line-height: 36px;
  }
`

export const GreenDot = styled.div`
  display: inline-block;
  margin-bottom: 1px;
  margin-right: 8px;
  border-radius: 12px;
  width: 6px;
  height: 6px;
  background-color: ${upColor};
  animation: flickerAnimation 3s infinite;

  @keyframes flickerAnimation {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.1;
    }
    100% {
      opacity: 1;
    }
  }
`

export const PrimaryText = styled.div<{ color?: string }>`
  color: ${(props) => props.color || primaryColor};
  display: inline-block;
`

export const Card = styled.div`
  border-radius: 13px;
  background: ${backgroundColorLight};
  box-shadow: 0 4px 4px #00000040;
`

export const AnimatedCard = styled.div`
  border-radius: 13px;
  background: ${backgroundColorLight};
  box-shadow: 0 4px 4px #00000040;
  will-change: opacity, transform;
  animation: ${fadeInFromLeft} 500ms;
`

export const FadeIn = styled.div`
  will-change: opacity;
  animation: ${fadeIn} 500ms;
`

export const FadeInFromTop = styled.div`
  will-change: opacity, transform;
  animation: ${fadeInFromTop} 500ms;
`

export const FadeInFromRight = styled.div`
  will-change: opacity, transform;
  animation: ${fadeInFromRight} 500ms;
`

export const FadeInFromBottom = styled.div`
  will-change: opacity, transform;
  animation: ${fadeInFromBottom} 500ms;
`

export const FadeInFromLeft = styled.div`
  will-change: opacity, transform;
  animation: ${fadeInFromLeft} 500ms;
`
