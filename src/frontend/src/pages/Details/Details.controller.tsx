import { DAOMetadata, MasterDataTokenMeta } from 'helpers/datadao'
import { DataDao, exampleDataDaos } from 'helpers/exampleDataDaos'
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

  const dataDao: MasterDataTokenMeta | undefined = (useSelector((state: State) => state.daos.daos).filter(
    (dao) => dao.daoAddress === id,
  )[0] as unknown) as MasterDataTokenMeta | undefined

  if (!dataDao) return <div>DAO not found</div>
  return <DetailsView drizzle={drizzle} drizzleState={drizzleState} dataDao={dataDao} />
}
