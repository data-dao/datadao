import * as React from 'react'

import { CreateView } from './Create.view'

export type CreateProps = {
  drizzle: any
  drizzleState: any
}

export const Create = ({drizzle, drizzleState}: CreateProps) => {
  return <CreateView drizzle={drizzle} drizzleState={drizzleState} />
}
