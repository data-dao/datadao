import { RESET, RESTORE } from 'app/App.actions'
import { UPDATE_DAOS } from 'pages/Browse/Browse.actions'

export interface DaosState {
  daos: any[]
}

const daosDefaultState: DaosState = {
  daos: []
}

export function daos(state = daosDefaultState, action: any): DaosState {
  switch (action.type) {
    // case RESET: {
    //   return daosDefaultState
    // }
    // case RESTORE: {
    //   return daosDefaultState
    // }
    case UPDATE_DAOS:
      return {
        daos: action.payload,
      }
    default:
      return state
  }
}
