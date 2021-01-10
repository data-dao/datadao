export const UPDATE_DAOS = 'UPDATE_DAOS'
export const updateDaos = (daos: any) => (dispatch: any) => {
  dispatch({
    type: UPDATE_DAOS,
    payload: daos,
  })
}
