import * as React from 'react'
import { useDispatch } from 'react-redux'
import { DrizzleContext } from '@drizzle/react-plugin'

import { BrowseView } from './Browse.view'
import { showLiquidity } from 'app/App.components/LiquidityModal/LiquidityModal.actions'

export const Browse = () => {
  const dispatch = useDispatch()

  const showDataCallback = (dataId: number) => {
    dispatch(showLiquidity(dataId))
  }

  return (
    <DrizzleContext.Consumer>
      {(drizzleContext: any) => {
        const { drizzle, drizzleState, initialized } = drizzleContext

        if (!initialized) {
          return 'Loading...'
        }

        return <BrowseView showDataCallback={showDataCallback} drizzle={drizzle} drizzleState={drizzleState} />
      }}
    </DrizzleContext.Consumer>
  )
}
