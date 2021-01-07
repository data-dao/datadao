import { DataDao, exampleDataDaos } from 'helpers/exampleDataDaos'
import * as React from 'react'
import { useParams } from 'react-router'

import { ParticipateView } from './Participate.view'

type ParticipateProps = {
  drizzle: any
  drizzleState: any
}

export const Participate = ({ drizzle, drizzleState }: ParticipateProps) => {
  let { id } = useParams() as { id: string }
  const dataDao: DataDao | undefined = exampleDataDaos.filter((dao: DataDao) => dao.id === id).shift()

  if (!dataDao) return <div>DAO not found</div>
  return <ParticipateView drizzle={drizzle} drizzleState={drizzleState} dataDao={dataDao} />
}
