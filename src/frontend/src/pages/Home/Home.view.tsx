import { Button } from 'app/App.components/Button/Button.controller'
import * as React from 'react'
import { Link } from 'react-router-dom'

// prettier-ignore
import { HomeStyled } from './Home.style'

export const HomeView = () => {
  return (
    <HomeStyled>
      <h1>Data DAO</h1>
      <div>Merging decentralized governance and incentive mechanism into a permissionless data marketplace!</div>
      <Link to="/get-started">
        <Button text="Get started" icon="home" />
      </Link>
    </HomeStyled>
  )
}
