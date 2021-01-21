import { useOcean } from '@oceanprotocol/react'
import { ContributionMeta, fetchContributions, MasterDataTokenMeta } from 'helpers/datadao'
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
  const [contributions, setContributions] = React.useState<ContributionMeta[]>([])

  const dataDao: MasterDataTokenMeta | undefined = (useSelector((state: State) => state.daos.daos).filter(
    (dao) => dao.daoAddress === id,
  )[0] as unknown) as MasterDataTokenMeta | undefined

  const masterDataTokenAddr = dataDao?.tokenAddress
  React.useEffect(() => {
    console.log(ocean, masterDataTokenAddr)
    ;(async function getContribs() {
      if (ocean && masterDataTokenAddr) {
        const contribs = await fetchContributions(masterDataTokenAddr, ocean, drizzle)
        setContributions(contribs)
      }
    })()
  }, [ocean])

  if (!dataDao) return <div>DAO not found</div>
  return (
    <DetailsView
      drizzle={drizzle}
      drizzleState={drizzleState}
      dataDao={dataDao}
      contributions={contributions}
      myAddress={account?.getId()}
    />
  )
}
