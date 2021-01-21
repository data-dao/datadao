import { Spin } from 'antd'
import { Button } from 'app/App.components/Button/Button.controller'
import { FilecoinUploader, IFile } from 'app/App.components/FilecoinUploader/FilecoinUploader.controller'
import { Input } from 'app/App.components/Input/Input.controller'
import { MasterDataTokenMeta } from 'helpers/datadao'
import { DataTokenOpts } from 'helpers/datadao'
import { BrowseDataDescription, BrowseDataHeader, BrowseDataHeaderTitle } from 'pages/Browse/Browse.style'
import * as React from 'react'

// prettier-ignore
import { ParticipateColums, ParticipateMain, ParticipatePublishing, ParticipateRequirement, ParticipateRows, ParticipateStyled } from './Participate.style'

type ParticipateViewProps = {
  // drizzle: any
  // drizzleState: any
  dataDao: MasterDataTokenMeta
  publishAsset: (
    datasetName: string,
    authorName: string,
    license: string,
    dataURI: string,
    file: IFile,
    totalRecords: string,
    dataTokenOpts: DataTokenOpts,
  ) => void
  isPublishing?: boolean
  processingMsg?: string
}

export const ParticipateView = ({ dataDao, publishAsset, isPublishing, processingMsg }: ParticipateViewProps) => {
  const [datasetName, setDatasetName] = React.useState<string>('')
  const [authorName, setAuthorName] = React.useState<string>('')
  const [license, setLicense] = React.useState<string>('MIT')
  // const [tokenName, setTokenName] = React.useState<string>('')
  // const [tokenCap, setTokenCap] = React.useState<string>('')
  // const [tokenSymbol, setTokenSymbol] = React.useState<string>('')
  const [dataUrl, setDataUrl] = React.useState<string>('')
  const [file, setFile] = React.useState<IFile>()
  const [totalRecords, setTotalRecords] = React.useState<string>('')

  const dataTokenOpts = {} // TODO: set token params

  return (
    <ParticipateStyled>
      <h1>Participate</h1>
      <ParticipateColums>
        <ParticipateRows>
          <div>
            <BrowseDataHeader>
              <img alt="life" src={`/images/life.png`} />
              <BrowseDataHeaderTitle>{dataDao.metadata?.title}</BrowseDataHeaderTitle>
            </BrowseDataHeader>
            <BrowseDataDescription>{dataDao.metadata?.description}</BrowseDataDescription>
          </div>
          <div>
            <BrowseDataHeaderTitle>Requirements</BrowseDataHeaderTitle>
            <ParticipateRequirement>{dataDao.metadata?.customRequirements[0]?.description}</ParticipateRequirement>
            <ParticipateRequirement>{dataDao.metadata?.customRequirements[1]?.description}</ParticipateRequirement>
            <a href={dataDao.metadata?.sampleData} target="_blank">Download Sample File</a>
          </div>
        </ParticipateRows>
        <ParticipateMain>
          <BrowseDataHeaderTitle>Upload and publish your data</BrowseDataHeaderTitle>
          <Input
            icon="ether"
            name="datasetName"
            placeholder="Name"
            type="text"
            onChange={(e) => setDatasetName(e.target.value)}
            value={datasetName}
            onBlur={() => {}}
            inputStatus={undefined}
            errorMessage={undefined}
          />
          <Input
            icon="ether"
            name="authorName"
            placeholder="Author"
            type="text"
            onChange={(e) => setAuthorName(e.target.value)}
            value={authorName}
            onBlur={() => {}}
            inputStatus={undefined}
            errorMessage={undefined}
          />
          <FilecoinUploader
            callback={(url: string, _file: IFile) => {
              setDataUrl(url)
              setFile(_file)
            }}
          />
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
          <Input
            icon="ether"
            name="totalRecords"
            placeholder="No. Records"
            type="text"
            onChange={(e) => setTotalRecords(e.target.value)}
            value={totalRecords}
            onBlur={() => {}}
            inputStatus={undefined}
            errorMessage={undefined}
          />
          <Button
            disabled={isPublishing}
            text="Publish data asset and send data token to the DAO"
            onClick={() => publishAsset(datasetName, authorName, license, dataUrl, file!, totalRecords, dataTokenOpts)}
          />
          {isPublishing && (
            <ParticipatePublishing>
              <Spin spinning={isPublishing} size="large" tip={processingMsg}></Spin>
            </ParticipatePublishing>
          )}
        </ParticipateMain>
      </ParticipateColums>
    </ParticipateStyled>
  )
}
