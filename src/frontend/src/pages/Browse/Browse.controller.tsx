import * as React from 'react'
import { DrizzleContext } from '@drizzle/react-plugin'

import { BrowseView } from './Browse.view'

export const Browse = () => {
  return (
    <DrizzleContext.Consumer>
      {(drizzleContext: any) => {
        const { drizzle, drizzleState, initialized } = drizzleContext

        if (!initialized) {
          return 'Loading...'
        }

        return <BrowseView drizzle={drizzle} drizzleState={drizzleState} />
      }}
    </DrizzleContext.Consumer>
  )
}
