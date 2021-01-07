export const SHOW_LIQUIDITY = 'SHOW_LIQUIDITY'
export const HIDE_LIQUIDITY = 'HIDE_LIQUIDITY'

export const showLiquidity = (dataId: string) => (dispatch: any) => {
  dispatch({
    type: SHOW_LIQUIDITY,
    payload: { dataId },
  })
}

export const hideLiquidity = () => (dispatch: any) => {
  dispatch({
    type: HIDE_LIQUIDITY,
  })
}
