import { DDO } from '@oceanprotocol/lib'
import { Metadata } from '@oceanprotocol/lib/dist/node/ddo/interfaces/Metadata'
import { useOcean, usePublish } from '@oceanprotocol/react'
import { Button as AButton, notification, Result } from 'antd'
import { IFile } from 'app/App.components/FilecoinUploader/FilecoinUploader.controller'
import { MasterDataTokenMeta } from 'helpers/datadao'
import { contribute, DataTokenOpts, fetchDataDaos, fetchContributions } from 'helpers/datadao'
import * as React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { State } from 'reducers'

import { ParticipateView } from './Participate.view'

type ParticipateProps = {
  drizzle: any
  drizzleState: any
}

export const Participate = ({ drizzle, drizzleState }: ParticipateProps) => {
  let { id } = useParams() as { id: string }
  const [dataDao, setDataDao] = React.useState<MasterDataTokenMeta | undefined>()

  const dao: MasterDataTokenMeta | undefined = (useSelector((state: State) => state.daos.daos).filter(
    (dao) => dao.daoAddress === id,
  )[0] as unknown) as MasterDataTokenMeta | undefined

  React.useEffect(() => {
    if (!dao) { 
      fetchDataDaos(drizzle, id).then((daos: Array<MasterDataTokenMeta>) => {
        if (daos.length > 0) {
          setDataDao(daos[0])
        }
      })
    } else {
      setDataDao(dao)
    }
  }, [dao])

  const { ocean, web3, account } = useOcean()
  const { publish, publishStep, publishStepText, isLoading } = usePublish()

  const [ddo, setDdo] = React.useState<DDO | undefined | null>()
  const [isProcessing, toggleProcess] = React.useState<boolean>(false)

  // const masterDataTokenAddr = '0x2BAb70617b9099A23A900A2D3faF5054366c4e49'
  const masterDataTokenAddr = dataDao?.tokenAddress
  React.useEffect(() => {
    if (ocean && masterDataTokenAddr) fetchContributions(masterDataTokenAddr, ocean, drizzle)
  }, [ocean])

  const publishAsset = async (
    datasetName: string,
    authorName: string,
    license: string,
    dataURI: string,
    file: IFile,
    totalRecords: string,
    dataTokenOpts: DataTokenOpts,
  ) => {
    let success = false
    if (masterDataTokenAddr && ocean && web3) {
      toggleProcess(true)
      const asset = {
        main: {
          type: 'dataset',
          name: datasetName + new Date().toISOString(),
          dateCreated: new Date(Date.now()).toISOString().split('.')[0] + 'Z', // remove milliseconds
          author: authorName,
          license: license,
          files: [
            {
              url: dataURI,
              // checksum: 'efb2c764274b745f5fc37f97c6b0e761',
              contentLength: file ? file.contentLength : '',
              contentType: file ? file.contentType : '',
              // encoding: 'UTF-8',
              // compression: 'zip'
            },
          ],
        },
      }

      try {
        const ddo = await publish(asset as Metadata, 'access', dataTokenOpts)
        console.log('THE DDO ==>', ddo)

        // const dataTokenAddr = '0x452859c5E0d4Dd53Bf95404f45E1D2eD26Bd780a'
        const dataTokenAddr = ddo!.dataToken
        const minToMint = '200' // TODO

        success = await contribute(masterDataTokenAddr, dataTokenAddr, account.getId(), minToMint, totalRecords, {
          drizzle,
          web3,
        })

        if (!success) {
          notification.open({
            message: 'Process Failed',
            description: 'Failed to record your contribution',
          })
        }

        setDdo(ddo)
      } catch (e) {
        console.log('ERROR! in Participate', e)
        notification.open({
          message: 'Process Failed',
          description: 'Something wrong happened',
        })
      }

      toggleProcess(false)
    } else {
      notification.open({
        message: 'Process Failed',
        description: 'Cannot connect to your wallet',
      })
    }
  }

  if (!dataDao) return <div>Loading...</div>

  let processingMsg = 'Preparing contribution...'
  if (publishStep === 7 && !isLoading) {
    processingMsg = 'Sending contribution to DAO...'
  } else if (publishStepText) {
    processingMsg = publishStepText
  }

  return ddo && !isProcessing ? (
    <Result
      status="success"
      title="Congratulations!"
      subTitle="Your contribution has been added to the DataDAO!"
      extra={[
        <Link to={`/details/${id}`}>
          <AButton type="primary" key="console">
            Return to DataDAO
          </AButton>
        </Link>,
        <a href={`https://market.oceanprotocol.com/asset/${ddo?.id}`} target="_blank">
          <AButton key="marketplace">View on Ocean Marketplace</AButton>
        </a>,
      ]}
    />
  ) : (
    <ParticipateView
      dataDao={dataDao}
      publishAsset={publishAsset}
      isPublishing={isProcessing}
      processingMsg={processingMsg}
    />
  )
}
