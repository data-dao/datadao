export type DataDao = {
  id: string
  name: string
  description: string
  icon: string
  requirement1: string
  requirement2?: string
  requirement3?: string
  amountNeeded: number
  amountSoFar: number
  members: number
  yourStake: number
  price: number
  governanceUrl: string
  daoUrl: string
  poolUrl: string
}

export const exampleDataDaos: DataDao[] = [
  {
    id: 'dao0',
    name: 'Shipping Data',
    description: 'This dataset is about shipment data for UPS and Fedex',
    icon: 'shipping',
    requirement1: 'All data should be for UPS or FEDEX',
    amountNeeded: 5000,
    amountSoFar: 3000,
    members: 12,
    yourStake: 44,
    price: 236.04,
    governanceUrl: '',
    daoUrl: '',
    poolUrl: '',
  },
  {
    id: 'dao1',
    name: 'Life Data',
    description: 'This dataset is about grow rate of Tree of multiple kinds',
    icon: 'life',
    requirement1: 'Growth rates must be in cm per day',
    amountNeeded: 1000,
    amountSoFar: 1000,
    members: 45,
    yourStake: 0,
    price: 12.83,
    governanceUrl: '',
    daoUrl: '',
    poolUrl: '',
  },
  {
    id: 'dao2',
    name: 'Flight Data',
    description: 'Dataset of all incoming anf outgoing flights from New York',
    icon: 'flight',
    requirement1: 'Must exclude canceled flights',
    amountNeeded: 5,
    amountSoFar: 0,
    members: 0,
    yourStake: 0,
    price: 1937.34,
    governanceUrl: '',
    daoUrl: '',
    poolUrl: '',
  },
]
