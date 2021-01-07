import styled from 'styled-components/macro'
import { backgroundColorLight } from 'styles'

export const DetailsStyled = styled.div`
  width: 1280px;
  max-width: 90vw;
  margin: 100px auto 0 auto;
`

export const DetailsColums = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-gap: 30px;
`

export const DetailsRows = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-gap: 30px;

  > div {
    background-color: ${backgroundColorLight};
    border-radius: 10px;
    padding: 20px;
  }
`

export const DetailsMain = styled.div`
  background-color: ${backgroundColorLight};
  border-radius: 10px;
  padding: 20px;

  button {
    margin-top: 20px;
  }

  > div:nth-child(odd) {
    margin-top: 5px;
    display: block;
    color: #ff6100;
  }

  > div:nth-child(even) {
    margin-top: 20px;
    display: block;
  }

  > div:nth-child(1) {
    color: #fff;
  }
`

export const DetailsRequirement = styled.div`
  margin-top: 10px;
  color: #9090a0;
`

export const DetailsHeader = styled.div`
  display: grid;
  grid-template-columns: auto 240px 240px 240px;
  grid-gap: 10px;

  > h1 {
    margin: 0 0 20px 0;
  }
`

export const DetailsLinks = styled.div`
  background-color: ${backgroundColorLight};
  border-radius: 10px;
  padding: 20px;

  > a {
    text-decoration: underline !important;
    display: block;
    margin-top: 20px;
  }
`
