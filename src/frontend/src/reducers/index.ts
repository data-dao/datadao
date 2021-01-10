import { connectRouter } from 'connected-react-router'
import { combineReducers } from 'redux'

import { daos, DaosState } from './daos'
import { drawer, DrawerState } from './drawer'
import { liquidityModal, LiquidityModalState } from './liquidityModal'
import { loading, LoadingState } from './loading'
import { progressBar, ProgressBarState } from './progressBar'
import { toaster, ToasterState } from './toaster'

export const reducers = (history: any) =>
  combineReducers({
    router: connectRouter(history),
    loading,
    toaster,
    drawer,
    progressBar,
    liquidityModal,
    daos,
  })

export interface State {
  loading: LoadingState
  toaster: ToasterState
  drawer: DrawerState
  progressBar: ProgressBarState
  serviceWorker: ServiceWorkerState
  liquidityModal: LiquidityModalState
  daos: DaosState

}
