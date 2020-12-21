import { Button } from 'app/App.components/Button/Button.controller'
import { DataDao, exampleDataDaos } from 'helpers/exampleDataDaos'
import * as React from 'react'
import { Link } from 'react-router-dom'

// prettier-ignore
import { BrowseData, BrowseDataButtons, BrowseDataDescription, BrowseDataHeader, BrowseDataHeaderTitle, BrowseDatas, BrowseStyled } from './Browse.style'

type BrowseViewProps = {
  showDataCallback: (dataId: number) => void
  drizzle: any
  drizzleState: any
}

export const BrowseView = ({ showDataCallback, drizzle }: BrowseViewProps) => {
  // useEffect(() => {
  //   const contract = drizzle.contracts.Datas
  //   const dataKey = contract.methods['getDatas'].cacheCall()
  //   console.log(dataKey)
  // }, [])

  return (
    <BrowseStyled>
      <h1>Data Marketplace</h1>

      <BrowseDatas>
        {exampleDataDaos.map((dataDao: DataDao) => (
          <BrowseData key={dataDao._id}>
            <BrowseDataHeader>
              <img alt={dataDao.icon} src={`/images/${dataDao.icon}.png`} />
              <BrowseDataHeaderTitle>{dataDao.name}</BrowseDataHeaderTitle>
            </BrowseDataHeader>
            <BrowseDataDescription>{dataDao.description}</BrowseDataDescription>
            <BrowseDataButtons>
              <Link to="/participate">
                <Button text="Participate" />
              </Link>
              <Link to="/congrats">
                <Button text={`Buy Ξ ${dataDao.price}`} />
              </Link>
            </BrowseDataButtons>
          </BrowseData>
        ))}
      </BrowseDatas>
    </BrowseStyled>
  )
}
