import { useOcean } from '@oceanprotocol/react'
import { ContributionMeta, fetchContributions, fetchDataDaos, MasterDataTokenMeta } from 'helpers/datadao'
import * as React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { State } from 'reducers'

import { DetailsView } from './Details.view'

type DetailsProps = {
  drizzle: any
  drizzleState: any
}

export const Details = ({ drizzle, drizzleState }: DetailsProps) => {
  let { id } = useParams() as { id: string }
  const { ocean, web3, account } = useOcean()
  const [loading, toggleLoading] = React.useState<boolean>(true)
  const [contributions, setContributions] = React.useState<ContributionMeta[]>([])
  const [dataDao, setDataDao] = React.useState<MasterDataTokenMeta | undefined>()

  const dao = (useSelector((state: State) => state.daos.daos).filter((dao) => dao.daoAddress === id)[0] as unknown) as
    | MasterDataTokenMeta
    | undefined

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

  const masterDataTokenAddr = dataDao?.tokenAddress
  React.useEffect(() => {
    if (ocean && masterDataTokenAddr) {
      fetchContributions(masterDataTokenAddr, ocean, drizzle).then((contribs: Array<ContributionMeta>) => {
        setContributions(contribs)
        toggleLoading(false)
      })
    }
  }, [masterDataTokenAddr, ocean])

  if (loading) return <div>Loading DataDAO</div>
  if (!dataDao) return <div>DAO not found</div>
  return (
    <DetailsView
      drizzle={drizzle}
      drizzleState={drizzleState}
      dataDao={dataDao}
      contributions={contributions}
      myAddress={account ? account.getId() : ''}
    />
  )
}
