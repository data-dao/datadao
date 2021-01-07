import { DataDao, exampleDataDaos } from 'helpers/exampleDataDaos'
import * as React from 'react'
import { useParams } from 'react-router'

import { DetailsView } from './Details.view'

type DetailsProps = {
  drizzle: any
  drizzleState: any
}

export const Details = ({ drizzle, drizzleState }: DetailsProps) => {
  let { id } = useParams() as { id: string }
  const dataDao: DataDao | undefined = exampleDataDaos.filter((dao: DataDao) => dao.id === id).shift()

  if (!dataDao) return <div>DAO not found</div>
  return <DetailsView drizzle={drizzle} drizzleState={drizzleState} dataDao={dataDao} />
}
