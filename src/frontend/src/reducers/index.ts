import { connectRouter } from 'connected-react-router'
import { combineReducers } from 'redux'


import { drawer, DrawerState } from './drawer'
import { loading, LoadingState } from './loading'
import { progressBar, ProgressBarState } from './progressBar'

import { toaster, ToasterState } from './toaster'

import { liquidityModal, LiquidityModalState } from './liquidityModal'

export const reducers = (history: any) =>
  combineReducers({
    router: connectRouter(history),
    loading,
    toaster,
    drawer,
    progressBar,
    liquidityModal,
  })

export interface State {
  loading: LoadingState
  toaster: ToasterState
  drawer: DrawerState
  progressBar: ProgressBarState
  serviceWorker: ServiceWorkerState
  liquidityModal: LiquidityModalState

}
