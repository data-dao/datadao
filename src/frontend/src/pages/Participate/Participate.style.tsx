import styled from 'styled-components/macro'
import { backgroundColorLight } from 'styles'

export const ParticipateStyled = styled.div`
  width: 1280px;
  max-width: 90vw;
  margin: 100px auto 0 auto;
`

export const ParticipateColums = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-gap: 30px;
`

export const ParticipateRows = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-gap: 30px;

  > div {
    background-color: ${backgroundColorLight};
    border-radius: 10px;
    padding: 20px;
  }
`

export const ParticipateMain = styled.div`
  background-color: ${backgroundColorLight};
  border-radius: 10px;
  padding: 20px;

  button {
    margin-top: 20px;
  }

  input {
    margin-top: 30px;
  }
`

export const ParticipateRequirement = styled.div`
  margin-top: 10px;
  color: #9090a0;
`

export const ParticipatePublishing = styled.div`
  margin: auto;
  padding-top: 20px;
  text-align: center;
`
