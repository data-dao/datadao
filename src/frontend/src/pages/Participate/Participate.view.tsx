import { Button } from 'app/App.components/Button/Button.controller'
import * as React from 'react'
import { DataDao, exampleDataDaos } from 'helpers/exampleDataDaos'

// prettier-ignore
import { ParticipateColums, ParticipateMain, ParticipateRequirement, ParticipateRows, ParticipateStyled } from './Participate.style'
import { BrowseDataHeader, BrowseDataHeaderTitle, BrowseDataDescription } from 'pages/Browse/Browse.style'
import { Input } from 'app/App.components/Input/Input.controller'

type ParticipateViewProps = {
  drizzle: any
  drizzleState: any
  dataDao: DataDao
}

export const ParticipateView = ({ drizzle, drizzleState, dataDao }: ParticipateViewProps) => {
  const [dataUrl, setDataUrl] = React.useState<string>('')

  return (
    <ParticipateStyled>
      <h1>Participate</h1>
      <ParticipateColums>
        <ParticipateRows>
          <div>
            <BrowseDataHeader>
              <img alt={dataDao.icon} src={`/images/${dataDao.icon}.png`} />
              <BrowseDataHeaderTitle>{dataDao.name}</BrowseDataHeaderTitle>
            </BrowseDataHeader>
            <BrowseDataDescription>{dataDao.description}</BrowseDataDescription>
          </div>
          <div>
            <BrowseDataHeaderTitle>Requirements</BrowseDataHeaderTitle>
            <ParticipateRequirement>{dataDao.requirement1}</ParticipateRequirement>
          </div>
        </ParticipateRows>
        <ParticipateMain>
          <BrowseDataHeaderTitle>Upload and publsh your data </BrowseDataHeaderTitle>
          <Input
            icon="ether"
            name="dataurl"
            placeholder="Data URL"
            type="text"
            onChange={(e) => setDataUrl(e.target.value)}
            value={dataUrl}
            onBlur={() => {}}
            inputStatus={undefined}
            errorMessage={undefined}
          />
          <Button
            text="Publish data asset and send data token to the DAO"
            onClick={() => drizzle.contracts.TestContract.methods.newStorage(dataUrl).send()}
          />
        </ParticipateMain>
      </ParticipateColums>
    </ParticipateStyled>
  )
}
