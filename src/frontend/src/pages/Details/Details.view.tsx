import { Button } from 'app/App.components/Button/Button.controller'
import { DataDao, exampleDataDaos } from 'helpers/exampleDataDaos'
import { BrowseDataDescription, BrowseDataHeader, BrowseDataHeaderTitle } from 'pages/Browse/Browse.style'
import * as React from 'react'
import { Link } from 'react-router-dom'

// prettier-ignore
import { DetailsColums, DetailsHeader, DetailsLinks, DetailsMain, DetailsRequirement, DetailsRows, DetailsStyled } from './Details.style'

type DetailsViewProps = {
  drizzle: any
  drizzleState: any
  dataDao: DataDao
}

export const DetailsView = ({ drizzle, drizzleState, dataDao }: DetailsViewProps) => {
  return (
    <DetailsStyled>
      <DetailsHeader>
        <h1>Details</h1>
        <Link to={`/participate/${dataDao.id}`}>
          <Button text="Contribute Data" />
        </Link>
        <Link to="/congrats">
          <Button
            onClick={() =>
              drizzle.contracts.TestContract.methods.newStorage('0x1143C5F5298Ac520c20c110B400C05b13A60099a').send()
            }
            text="Redeem your stake"
          />
        </Link>
        <Link to="/congrats">
          <Button
            onClick={() =>
              drizzle.contracts.TestContract.methods.newStorage('0x1143C5F5298Ac520c20c110B400C05b13A60099a').send()
            }
            text="Buy dataset Ξ 1093.23"
          />
        </Link>
      </DetailsHeader>

      <DetailsColums>
        <DetailsRows>
          <div>
            <BrowseDataHeader>
              <img alt={dataDao.icon} src={`/images/${dataDao.icon}.png`} />
              <BrowseDataHeaderTitle>{dataDao.name}</BrowseDataHeaderTitle>
            </BrowseDataHeader>
            <BrowseDataDescription>{dataDao.description}</BrowseDataDescription>
          </div>
          <div>
            <BrowseDataHeaderTitle>Requirements</BrowseDataHeaderTitle>
            <DetailsRequirement>{dataDao.requirement1}</DetailsRequirement>
          </div>
        </DetailsRows>

        <DetailsMain>
          <BrowseDataHeaderTitle>Infos</BrowseDataHeaderTitle>
          <div>Number of data records already been contributed</div>
          <div>{dataDao.amountSoFar}</div>
          <div>Number of DataDAO members</div>
          <div>{dataDao.members}</div>
          <div>Total DataPool token Minted</div>
          <div>{dataDao.amountSoFar}</div>
          <div>Your stake</div>
          <div>{dataDao.yourStake}</div>
        </DetailsMain>

        <DetailsLinks>
          <BrowseDataHeaderTitle>Links</BrowseDataHeaderTitle>
          <a href={dataDao.governanceUrl}>Governance dashboard</a>
          <a href={dataDao.daoUrl}>DAO address</a>
          <a href={dataDao.poolUrl}>DataPool Contract</a>
        </DetailsLinks>
      </DetailsColums>
    </DetailsStyled>
  )
}
