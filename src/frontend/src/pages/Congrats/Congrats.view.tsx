import { Button } from 'app/App.components/Button/Button.controller'
import * as React from 'react'

// prettier-ignore
import { CongratsStyled } from './Congrats.style'

export const CongratsView = () => {
  return (
    <CongratsStyled>
      <svg>
        <use xlinkHref="/icons/sprites.svg#congrats" />
      </svg>
      <div>
        <h1>Congrats</h1>
        <div>
          Operation successfull on{' '}
          <a href="https://etherscan.io/address/0x1143c5f5298ac520c20c110b400c05b13a60099a" target="_blank">
            <u>0x1143c5f5298ac520c20c110b400c05b13a60099a</u>
          </a>
        </div>
      </div>
    </CongratsStyled>
  )
}
