import { Button } from 'app/App.components/Button/Button.controller'
import { DAOMetadata, MasterDataTokenMeta } from 'helpers/datadao'
import { BrowseDataDescription, BrowseDataHeader, BrowseDataHeaderTitle } from 'pages/Browse/Browse.style'
import * as React from 'react'
import { Link } from 'react-router-dom'

// prettier-ignore
import { DetailsColums, DetailsHeader, DetailsLinks, DetailsMain, DetailsRequirement, DetailsRows, DetailsStyled } from './Details.style'

type DetailsViewProps = {
  drizzle: any
  drizzleState: any
  dataDao: MasterDataTokenMeta
}

export const DetailsView = ({ drizzle, drizzleState, dataDao }: DetailsViewProps) => {
  return (
    <DetailsStyled>
      <DetailsHeader>
        <h1>Details</h1>
        <Link to={`/participate/${dataDao.daoAddress}`}>
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
              <img alt="life" src={`/images/life.png`} />
              <BrowseDataHeaderTitle>{dataDao.metadata?.title}</BrowseDataHeaderTitle>
            </BrowseDataHeader>
            <BrowseDataDescription>{dataDao.metadata?.description}</BrowseDataDescription>
          </div>
          <div>
            <BrowseDataHeaderTitle>Requirements</BrowseDataHeaderTitle>
            <DetailsRequirement>{dataDao.metadata?.customRequirements[0]?.description}</DetailsRequirement>
            <DetailsRequirement>{dataDao.metadata?.customRequirements[1]?.description}</DetailsRequirement>
          </div>
        </DetailsRows>

        <DetailsMain>
          <BrowseDataHeaderTitle>Infos</BrowseDataHeaderTitle>
          <div>Number of data records already been contributed</div>
          <div>0</div>
          <div>Number of DataDAO members</div>
          <div>0</div>
          <div>Total DataPool token Minted</div>
          <div>0</div>
          <div>Your stake</div>
          <div>0</div>
        </DetailsMain>

        <DetailsLinks>
          <BrowseDataHeaderTitle>Links</BrowseDataHeaderTitle>
          <a href={undefined}>Governance dashboard</a>
          <a href={undefined}>DAO address</a>
          <a href={undefined}>DataPool Contract</a>
        </DetailsLinks>
      </DetailsColums>
    </DetailsStyled>
  )
}
