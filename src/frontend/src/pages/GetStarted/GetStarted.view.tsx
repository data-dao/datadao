import { Button } from 'app/App.components/Button/Button.controller'
import * as React from 'react'
import { Link } from 'react-router-dom'

// prettier-ignore
import { GetStartedStyled } from './GetStarted.style'

export const GetStartedView = () => {
  return (
    <GetStartedStyled>
      <h1>Get started</h1>
      <div>There you will be able to create a new Data DAO and request some data</div>
      <Link to="/create">
        <Button text="Create a new Data DAO" icon="home" />
      </Link>

      <div>There you will be able to participate in existing DAOs or buy a the DAO dataset</div>
      <Link to="/browse">
        <Button text="Browse existsing Data DAOs" icon="home" />
      </Link>
    </GetStartedStyled>
  )
}
