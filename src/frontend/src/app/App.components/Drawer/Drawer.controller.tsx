import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { State } from 'reducers'

import { hideDrawer } from './Drawer.actions'
import { DrawerView } from './Drawer.view'

export const Drawer = () => {
  const dispatch = useDispatch()
  const showing = useSelector((state: State) => state.drawer.showing)
  const { pathname } = useLocation()

  const hideCallback = () => {
    dispatch(hideDrawer())
  }

  return <DrawerView showing={showing} hideCallback={hideCallback} pathname={pathname} />
}
