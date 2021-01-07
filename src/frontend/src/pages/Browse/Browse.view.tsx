import { Button } from 'app/App.components/Button/Button.controller'
import { DataDao, exampleDataDaos } from 'helpers/exampleDataDaos'
import * as React from 'react'
import { Link } from 'react-router-dom'

// prettier-ignore
import { BrowseData, BrowseDataDescription, BrowseDataHeader, BrowseDataHeaderTitle, BrowseDataProgress, BrowseDataProgressBar, BrowseDataProgressBarInner, BrowseDatas, BrowseStyled } from './Browse.style'

type BrowseViewProps = {
  drizzle: any
  drizzleState: any
}

export const BrowseView = ({ drizzle }: BrowseViewProps) => {
  return (
    <BrowseStyled>
      <h1>Data Marketplace</h1>
      <Link to="/create" style={{ display: 'inline-block', width: '300px', float: 'right', marginTop: '28px' }}>
        <Button text="Create new Data DAO and request data" />
      </Link>

      <BrowseDatas>
        {exampleDataDaos.map((dataDao: DataDao) => (
          <Link to={`/details/${dataDao.id}`}>
            <BrowseData key={dataDao.id}>
              <BrowseDataHeader>
                <img alt={dataDao.icon} src={`/images/${dataDao.icon}.png`} />
                <BrowseDataHeaderTitle>{dataDao.name}</BrowseDataHeaderTitle>
              </BrowseDataHeader>
              <BrowseDataDescription>{dataDao.description}</BrowseDataDescription>
              <BrowseDataProgress>
                <div>Completion</div>
                <div>{(dataDao.amountSoFar / dataDao.amountNeeded) * 100}%</div>
                <BrowseDataProgressBar>
                  <BrowseDataProgressBarInner percent={(dataDao.amountSoFar / dataDao.amountNeeded) * 100} />
                </BrowseDataProgressBar>
              </BrowseDataProgress>
            </BrowseData>
          </Link>
        ))}
      </BrowseDatas>
    </BrowseStyled>
  )
}
