import { DataDao, exampleDataDaos } from 'helpers/exampleDataDaos'
import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { State } from 'reducers'
import web3 from 'web3'

import { hideLiquidity } from './LiquidityModal.actions'
import { LiquidityModalView } from './LiquidityModal.view'

type LiquidityModalProps = {
  drizzle: any
  drizzleState: any
}

export const LiquidityModal = ({ drizzle, drizzleState }: LiquidityModalProps) => {
  const dispatch = useDispatch()
  const { dataId, showing } = useSelector((state: State) => state.liquidityModal)

  const hideCallback = () => {
    dispatch(hideLiquidity())
  }

  const data: DataDao = exampleDataDaos[0]

  const buyCallback = (dataId: string, premium: number) => {
    console.log(dataId, premium)
  }

  return <LiquidityModalView showing={showing} data={data} hideCallback={hideCallback} buyCallback={buyCallback} />
}
