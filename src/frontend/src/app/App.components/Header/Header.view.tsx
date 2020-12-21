import * as React from 'react'
import { Link } from 'react-router-dom'

// prettier-ignore
import { HeaderMenu, HeaderStyled } from './Header.style'

export const HeaderView = () => {
  return (
    <HeaderStyled>
      <HeaderMenu>
        <Link to="/">
          <img alt="title" src="/images/title.svg" />
        </Link>
      </HeaderMenu>
    </HeaderStyled>
  )
}

HeaderView.propTypes = {}

HeaderView.defaultProps = {}
