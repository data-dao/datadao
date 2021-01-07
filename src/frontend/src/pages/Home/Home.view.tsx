import { Button } from 'app/App.components/Button/Button.controller'
import * as React from 'react'
import { Link } from 'react-router-dom'

// prettier-ignore
import { Home1, Home2, Home3, HomeJumbo, HomeStyled } from './Home.style'

export const HomeView = () => {
  return (
    <HomeStyled>
      <HomeJumbo>
        <h1>Data DAO</h1>
        <div>Merging decentralized governance and incentive mechanism into a permissionless data marketplace!</div>
        <Link to="/browse">
          <Button text="Get started" icon="home" />
        </Link>
      </HomeJumbo>
      <Home1>
        <div>
          <div>
            <h1>The Vision of DataDAO</h1>
            <div>
              An infrastructure of collaboration for the data economy. DataDAO mission is to allow the pooling of data
              assets into a meaningful and valuable dataset that it’s value is greater than the sum of it’s parts.
              DataDAO is in a mission to lay the foundations to a fairer and more inclusive value distribution between
              users and data owners, to data consumers.
            </div>
          </div>
          <img src="/images/home1.png" />
        </div>
      </Home1>
      <Home2>
        <div>
          <img src="/images/home2.png" />
          <div>
            <h1>The Innovation</h1>
            <div>
              DataDAO project use decentralized technology to create a new Data economy, combining primitives from three
              emerging diciplens - the triple DDD - Data MArketplace of Ocean Protocol, DeFi & incentive mechanism
              design, and DAO’s - decentralized Autonoumous organizations, levergaing the DAOstack tech stack.
            </div>
          </div>
        </div>
      </Home2>
      <Home1>
        <div>
          <div>
            <b>Data Buyers</b>
            <br />
            <br />
            Anyone in need for a specific and unique dataset is able to open a campaign, define requierments, define the
            expected payout he is willing to pay for a dataset, and release it for anyone to contribute   Databuyers can
            decide on adding verification layer and
          </div>
          <div>
            <b>Data Contributers</b>
            <br />
            <br />
            Anyone can contribute to the creation of a dataset by uploading records. the data is being held encrypted
            and non-custidal at any point in time, until someone is buying the access to the complete dataset. The
            governance over the combined Dataset is done via a DAO governance dashboard, which enables the contributers
            to grow and further expend it through discussions and collective decision making, at scale.
          </div>
        </div>
      </Home1>
      <Home3>
        <div>
          <h1>Project Roadmap</h1>
          <img src="/images/roadmap.png" />
        </div>
      </Home3>
    </HomeStyled>
  )
}
