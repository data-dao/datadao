import { Button } from 'app/App.components/Button/Button.controller'
import { ContributionMeta, DAOMetadata, MasterDataTokenMeta } from 'helpers/datadao'
// prettier-ignore
import { BrowseDataDescription, BrowseDataHeader, BrowseDataHeaderTitle, BrowseDataProgress, BrowseDataProgressBar, BrowseDataProgressBarInner } from 'pages/Browse/Browse.style'
import * as React from 'react'
import { Link } from 'react-router-dom'

// prettier-ignore
import { DetailsColums, DetailsHeader, DetailsLinks, DetailsMain, DetailsRequirement, DetailsRows, DetailsStyled } from './Details.style'

type DetailsViewProps = {
  drizzle: any
  drizzleState: any
  dataDao: MasterDataTokenMeta
  contributions: ContributionMeta[]
  myAddress?: string
}

export const DetailsView = ({ drizzle, drizzleState, dataDao, contributions, myAddress }: DetailsViewProps) => {
  const recordsNumber = contributions.map((contrib) => parseInt(contrib.records)).reduce((a, b) => a + b, 0)
  const recordsNeeded = dataDao?.metadata?.requirements?.records ? dataDao?.metadata?.requirements?.records : 1

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
            text={`Buy dataset DAI ${parseInt(dataDao?.metadata?.purchasePrice as any | 0) / 1000000000000000000}`}
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
          <div>{recordsNumber}</div>
          <div>Number of DataDAO members</div>
          <div>{[...new Set(contributions.map((contrib) => contrib.contributor))].length}</div>
          <div>Total DataPool token Minted</div>
          <div>{contributions.length}</div>
          <div>Your stake</div>
          <div>{contributions.filter((contrib) => contrib.contributor === myAddress).length}</div>
        </DetailsMain>

        <DetailsLinks>
          <BrowseDataHeaderTitle>Links</BrowseDataHeaderTitle>
          <a href={`https://alchemy-2-rinkeby.herokuapp.com/dao/${dataDao.daoAddress.toLowerCase()}`} target="_blank">
            Governance dashboard
          </a>
          <a href={`https://rinkeby.etherscan.io/address/${dataDao.daoAddress}`} target="_blank">
            DAO address
          </a>
          <a href={`https://rinkeby.etherscan.io/address/${dataDao.tokenAddress}`} target="_blank">
            DataPool Contract
          </a>

          <BrowseDataProgress>
            <div>Completion</div>
            <div>{`${recordsNumber}/${recordsNeeded} (${(recordsNumber / recordsNeeded) * 100}%)`}</div>
            <BrowseDataProgressBar>
              <BrowseDataProgressBarInner percent={(recordsNumber / recordsNeeded) * 100} />
            </BrowseDataProgressBar>
          </BrowseDataProgress>
        </DetailsLinks>
      </DetailsColums>
    </DetailsStyled>
  )
}
