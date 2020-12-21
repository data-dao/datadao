import { RESET, RESTORE } from 'app/App.actions'
import {  HIDE_LIQUIDITY, SHOW_LIQUIDITY } from 'app/App.components/LiquidityModal/LiquidityModal.actions'

export interface LiquidityModalState {
  showing: boolean
  dataId?: number
}

const liquidityModalDefaultState: LiquidityModalState = {
  showing: false,
  dataId: undefined,
}

export function liquidityModal(state = liquidityModalDefaultState, action: any): LiquidityModalState {
  switch (action.type) {
    case RESET: {
      return liquidityModalDefaultState
    }
    case RESTORE: {
      return liquidityModalDefaultState
    }
    case SHOW_LIQUIDITY: {
      return {
        ...state,
        dataId: action.payload.dataId,
        showing: true
      }
    }
    case HIDE_LIQUIDITY: {
      return liquidityModalDefaultState
    }
    default:
      return state
  }
}
