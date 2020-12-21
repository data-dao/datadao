import * as React from 'react'

import { ParticipateView } from './Participate.view'

type ParticipateProps = {
  drizzle: any
  drizzleState: any
}

export const Participate = ({ drizzle, drizzleState }: ParticipateProps) => {
  return <ParticipateView drizzle={drizzle} drizzleState={drizzleState} />
}
