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

  const data: DataDao = exampleDataDaos.filter((dataContract) => dataContract._id === dataId)?.[0]

  const buyCallback = (dataId: number, premium: number) => {
    console.log(dataId, premium)
    console.log(drizzle.contracts)
    if (dataId === 0)
      drizzle.contracts.DataShipping.methods
        .provideLiquidity()
        .send({ value: web3.utils.toWei(premium as any, 'ether') })
    if (dataId === 1)
      drizzle.contracts.DataLife.methods.provideLiquidity().send({ value: web3.utils.toWei(premium as any, 'ether') })
    if (dataId === 2)
      drizzle.contracts.DataFlight.methods.provideLiquidity().send({ value: web3.utils.toWei(premium as any, 'ether') })
  }

  return <LiquidityModalView showing={showing} data={data} hideCallback={hideCallback} buyCallback={buyCallback} />
}
