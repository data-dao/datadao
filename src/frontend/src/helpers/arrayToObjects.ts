export const arrayToObjects = (array: any, key1: string, key2: string | undefined = undefined) => {
  const initialValue = {}
  return array.reduce((obj: any, item: any) => {
    if (key2)
      return {
        ...obj,
        [item[key1][key2]]: item,
      }
    else
      return {
        ...obj,
        [item[key1]]: item,
      }
  }, initialValue)
}
