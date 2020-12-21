import * as PropTypes from 'prop-types'
import * as React from 'react'
import { Link } from 'react-router-dom'

import { DrawerItem, DrawerMask, DrawerStyled } from './Drawer.style'

type DrawerViewProps = {
  showing: boolean
  hideCallback: () => void
  pathname: string
}

export const DrawerView = ({ showing, hideCallback, pathname }: DrawerViewProps) => (
  <>
    <DrawerMask className={`${showing}`} onClick={() => hideCallback()} />
    <DrawerStyled className={`${showing}`}>
      <h1>Menu</h1>

      <DrawerItem isSelected={pathname === '/'}>
        <Link to="/" onClick={() => hideCallback()}>
          <svg>
            <use xlinkHref="/icons/sprites.svg#home" />
          </svg>
          Home
        </Link>
      </DrawerItem>

      <DrawerItem isSelected={pathname === '/browse'}>
        <Link to="/browse" onClick={() => hideCallback()}>
          <svg>
            <use xlinkHref="/icons/sprites.svg#buy" />
          </svg>
          Marketplace
        </Link>
      </DrawerItem>
    </DrawerStyled>
  </>
)

DrawerView.propTypes = {
  showing: PropTypes.bool,
  hideCallback: PropTypes.func.isRequired,
  pathname: PropTypes.string.isRequired,
}

DrawerView.defaultProps = {
  showing: false,
  user: undefined,
}
