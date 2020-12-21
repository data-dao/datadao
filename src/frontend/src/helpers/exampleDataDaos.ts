export type DataDao = {
  _id: number
  name: string
  description: string
  icon: string
  requirement1: string
  price: number
}

export const exampleDataDaos: DataDao[] = [
  {
    _id: 0,
    name: 'Shipping Data',
    description: 'This dataset is about shipment data for UPS and Fedex',
    icon: 'shipping',
    requirement1: 'All data should be for UPS or FEDEX',
    price: 236.04,
  },
  {
    _id: 1,
    name: 'Life Data',
    description: 'This dataset is about grow rate of Tree of multiple kinds',
    icon: 'life',
    requirement1: 'Growth rates must be in cm per day',
    price: 12.83,
  },
  {
    _id: 2,
    name: 'Flight Data',
    description: 'Dataset of all incoming anf outgoing flights from New York',
    icon: 'flight',
    requirement1: 'Must exclude canceled flights',
    price: 1937.34,
  },
]
