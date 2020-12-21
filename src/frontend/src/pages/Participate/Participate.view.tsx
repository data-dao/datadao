import { Button } from 'app/App.components/Button/Button.controller'
import * as React from 'react'
import { DataDao, exampleDataDaos } from 'helpers/exampleDataDaos'

// prettier-ignore
import { ParticipateColums, ParticipateMain, ParticipateRequirement, ParticipateRows, ParticipateStyled } from './Participate.style'
import { BrowseDataHeader, BrowseDataHeaderTitle, BrowseDataDescription } from 'pages/Browse/Browse.style'

type ParticipateViewProps = {
  drizzle: any
  drizzleState: any
}

export const ParticipateView = ({ drizzle, drizzleState }: ParticipateViewProps) => {
  const dataDao = exampleDataDaos[0]

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
          <BrowseDataHeaderTitle>Steps</BrowseDataHeaderTitle>
          <Button
            text="1 - Upload Data (IPFS /. filecoin)"
            onClick={() =>
              drizzle.contracts.TestContract.methods.newStorage('0x1143C5F5298Ac520c20c110B400C05b13A60099a').send()
            }
          />
          <Button
            text="2 - Publish Data Asset"
            onClick={() =>
              drizzle.contracts.TestContract.methods.newStorage('0x1143C5F5298Ac520c20c110B400C05b13A60099a').send()
            }
          />
          <Button
            text="3 - Send DataToken to the DAO"
            onClick={() =>
              drizzle.contracts.TestContract.methods.newStorage('0x1143C5F5298Ac520c20c110B400C05b13A60099a').send()
            }
          />
          <Button
            text="4 - Redeem your stake"
            onClick={() =>
              drizzle.contracts.TestContract.methods.newStorage('0x1143C5F5298Ac520c20c110B400C05b13A60099a').send()
            }
          />
        </ParticipateMain>
      </ParticipateColums>
    </ParticipateStyled>
  )
}
