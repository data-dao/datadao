import { createGlobalStyle } from 'styled-components/macro'

import { fadeInFromLeft, slideLeftEnter, slideLeftExit, slideRightEnter, slideRightExit } from './animations'
import { backgroundColorDark, backgroundColorLight, placeholderColor, textColor } from './colors'

export const GlobalStyle = createGlobalStyle`
* {
  box-sizing: border-box;
}

body {
  font-family: 'Proxima Nova', Helvetica, Arial, sans-serif;
  font-display: optional;
  margin: 0;
  padding: 0;
  background: ${backgroundColorDark};
  background-repeat: no-repeat;
  background-position: center top;
  color: ${textColor};
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1 {
  font-size: 40px;
  font-weight: 700;
  display: inline-block;
  margin: 20px 0px;
}

h2 {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

input {
  color: ${textColor};
  font-size: 14px;
}

::placeholder {
  color: ${placeholderColor};
  font-size: 14px;
}

*:focus {
  outline: none;
}

a, a:visited {
  color: inherit;
  text-decoration: none !important;
  opacity: 1;
  transition: opacity 0.15s ease-in-out-out;
  will-change: opacity;
}

a:hover {
  opacity: 0.9;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
}

@keyframes autofill {
    0%,100% {
        color: ${textColor};
        background: ${backgroundColorDark};
    }
}

/* Change Autocomplete styles in Chrome*/
input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus,
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
    animation-delay: 1s;
    animation-name: autofill;
    animation-fill-mode: both;
}

.appear {
  opacity: 0;
  will-change: transform, opacity;
  animation: ${fadeInFromLeft} ease-in-out 1;
  animation-fill-mode: forwards;
  animation-duration: 0.2s;
}

.slide-right-enter-active {
  animation: ${slideRightEnter} 200ms;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in-out;
}

.slide-right-exit-active {
  animation: ${slideRightExit} 200ms;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in-out;
}

.slide-left-enter-active {
  animation: ${slideLeftEnter} 200ms;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in-out;
}

.slide-left-exit-active {
  animation: ${slideLeftExit} 200ms;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in-out;
}

/* 
.slide-right-enter {
  opacity: 0;
}
.slide-right-enter-active {
  opacity: 1;
  transition: opacity 200ms;
}
.slide-right-exit {
  opacity: 1;
}
.slide-right-exit-active {
  opacity: 0;
  transition: opacity 200ms;
}

.slide-left-enter {
  opacity: 0;
}
.slide-left-enter-active {
  opacity: 1;
  transition: opacity 200ms;
}
.slide-left-exit {
  opacity: 1;
}
.slide-left-exit-active {
  opacity: 0;
  transition: opacity 200ms;
} */

.grecaptcha-badge {
  visibility: hidden;
}

`
