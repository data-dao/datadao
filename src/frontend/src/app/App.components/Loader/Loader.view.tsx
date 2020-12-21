import * as React from 'react'

import { LoaderStyled, LoaderAnim } from './Loader.style'

export const Loader: any = () => (
  <LoaderStyled>
    <LoaderAnim>
      <img alt="0" src="/icons/0.svg" />
      <img alt="G" src="/icons/G.svg" />
      <img alt="A" src="/icons/A.svg" />
      <img alt="M" src="/icons/M.svg" />
      <img alt="E" src="/icons/E.svg" />
      <img alt="S" src="/icons/S.svg" />
    </LoaderAnim>
  </LoaderStyled>
)
