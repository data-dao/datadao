import styled from 'styled-components/macro'
import { backgroundColorLight, subTextColor } from 'styles'

export const LiquidityModalCard = styled.div`
  background-color: ${backgroundColorLight};
  border-radius: 10px;
  width: 440px;
  padding: 30px;
`

export const LiquidityModalInputs = styled.div`
  margin: 40px auto;

  > div {
    margin-top: 20px;
  }
`

export const LiquidityModalReward = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 10px;
`

export const LiquidityModalRewardTitle = styled.div`
  color: ${subTextColor};
`

export const LiquidityModalRewardEther = styled.div`
  font-size: 18px;
  text-align: right;
`

export const LiquidityModalBuy = styled.div`
  border: 1px solid white;
  font-size: 16px;
  border-radius: 40px;
  font-weight: bold;
  text-align: center;
  height: 36px;
  line-height: 36px;
  margin: 60px auto 0 auto;
  width: 210px;
  cursor: pointer;
`
