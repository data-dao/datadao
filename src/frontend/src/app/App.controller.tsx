import { DrizzleContext } from '@drizzle/react-plugin'
import { Drizzle, generateStore } from '@drizzle/store'
import { ConfigHelper, Logger } from '@oceanprotocol/lib'
import { OceanProvider } from '@oceanprotocol/react'
import { ConnectedRouter } from 'connected-react-router'
import drizzleOpts from 'drizzleOptions'
import { Browse } from 'pages/Browse/Browse.controller'
import { Congrats } from 'pages/Congrats/Congrats.controller'
import { Create } from 'pages/Create/Create.controller'
import { Details } from 'pages/Details/Details.controller'
import { Error404 } from 'pages/Error404/Error404.controller'
import { GetStarted } from 'pages/GetStarted/GetStarted.controller'
import { Home } from 'pages/Home/Home.controller'
import { Participate } from 'pages/Participate/Participate.controller'
import * as React from 'react'
import { Route, Switch } from 'react-router'

import { initializeArc } from '../helpers/arc'
import { Drawer } from './App.components/Drawer/Drawer.controller'
import { Hamburger } from './App.components/Hamburger/Hamburger.controller'
import { Header } from './App.components/Header/Header.controller'
import { LiquidityModal } from './App.components/LiquidityModal/LiquidityModal.controller'
import { ProgressBar } from './App.components/ProgressBar/ProgressBar.controller'
import { Toaster } from './App.components/Toaster/Toaster.controller'
import { history } from './App.store'

// @ts-ignore
const drizzleStore = generateStore(drizzleOpts)
// @ts-ignore
const drizzle = new Drizzle(drizzleOpts, drizzleStore)

const configRinkeby = new ConfigHelper().getConfig('rinkeby', 'e4588d11d73d47749c72f5f542832808')

// Initialize DAOStack & Web3
initializeArc()

export const App = () => {
  return (
    <DrizzleContext.Provider drizzle={drizzle}>
      <DrizzleContext.Consumer>
        {(drizzleContext: any) => {
          const { drizzle, drizzleState, initialized } = drizzleContext

          if (!initialized) {
            return 'Please connect to RINKEBY and refresh!'
          }

          return (
            <OceanProvider initialConfig={configRinkeby}>
              <ConnectedRouter history={history}>
                <Header />
                <Drawer />
                <Hamburger />
                <Switch>
                  {/* <Route exact path="/">
                  <Home />
                </Route> */}
                  <Route exact path="/get-started">
                    <GetStarted />
                  </Route>
                  <Route exact path="/create">
                    <Create drizzle={drizzle} drizzleState={drizzleState} />
                  </Route>
                  <Route exact path="/">
                    <Browse />
                  </Route>
                  <Route exact path="/details/:id">
                    <Details drizzle={drizzle} drizzleState={drizzleState} />
                  </Route>
                  <Route exact path="/participate/:id">
                    <Participate drizzle={drizzle} drizzleState={drizzleState} />
                  </Route>
                  <Route exact path="/congrats">
                    <Congrats />
                  </Route>
                  <Route>
                    <Error404 />
                  </Route>
                </Switch>
                <Toaster />
                <ProgressBar />
                <LiquidityModal drizzle={drizzle} drizzleState={drizzleState} />
              </ConnectedRouter>
            </OceanProvider>
          )
        }}
      </DrizzleContext.Consumer>
    </DrizzleContext.Provider>
  )
}
