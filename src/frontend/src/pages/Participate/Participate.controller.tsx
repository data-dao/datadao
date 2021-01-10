import { MasterDataTokenMeta } from 'helpers/datadao'
import { DataDao, exampleDataDaos } from 'helpers/exampleDataDaos'
import * as React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { State } from 'reducers'

import { ParticipateView } from './Participate.view'

type ParticipateProps = {
  drizzle: any
  drizzleState: any
}

export const Participate = ({ drizzle, drizzleState }: ParticipateProps) => {
  let { id } = useParams() as { id: string }
  const dataDao: MasterDataTokenMeta | undefined = (useSelector((state: State) => state.daos.daos).filter(
    (dao) => dao.daoAddress === id,
  )[0] as unknown) as MasterDataTokenMeta | undefined

  if (!dataDao) return <div>DAO not found</div>
  return <ParticipateView drizzle={drizzle} drizzleState={drizzleState} dataDao={dataDao} />
}
