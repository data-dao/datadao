import styled from 'styled-components/macro'

export const HomeStyled = styled.div`
  background: url('/images/bg.png');
  background-size: contain;
  background-repeat: no-repeat;
`

export const HomeJumbo = styled.div`
  margin: 50px auto 0 auto;
  width: 1080px;
  max-width: 90vw;
  padding: 130px 0 0 0;
  height: 470px;

  > div {
    width: 400px;
  }

  button {
    margin-top: 30px;
    width: 200px;
  }
`

export const Home1 = styled.div`
  background-color: #0e163a;

  > div {
    width: 1080px;
    max-width: 90vw;
    margin: 0 auto 0 auto;
    padding: 100px 0 100px 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
  }
`

export const Home2 = styled.div`
  > div {
    width: 1080px;
    max-width: 90vw;
    margin: 0 auto 0 auto;
    padding: 100px 0 100px 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
  }
`

export const Home3 = styled.div`
  > div {
    width: 1080px;
    max-width: 90vw;
    margin: 0 auto 0 auto;
    padding: 100px 0 100px 0;

    > h1 {
      display: block;
    }
  }
`
