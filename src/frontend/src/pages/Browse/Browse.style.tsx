import styled from 'styled-components/macro'
import { backgroundColorLight, FullPage, primaryColor, subTextColor, textColor } from 'styles'

export const BrowseStyled = styled(FullPage)`
  /* > h1 {
    margin: 20px 0 0 0;
  } */
`

export const BrowseDatas = styled.div`
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 50px;
  width: 100%;
`

export const BrowseData = styled.div`
  cursor: pointer;
  background-color: ${backgroundColorLight};
  border-radius: 10px;
  padding: 25px;

  transition: transform 0.2s;

  &:hover {
    transform: scale(1.04);
  }
`

export const BrowseDataImage = styled.img`
  width: 100%;
  border-radius: 5px;
`

export const BrowseDataFooter = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 6px 0 6px 0;

  > div:nth-child(1) {
    font-size: 16px;
    color: ${primaryColor};
    text-align: left;
    font-weight: bold;
  }

  > div:nth-child(2) {
    font-size: 16px;
    color: ${textColor};
    text-align: right;
  }

  > div:nth-child(3) {
    font-size: 12px;
    color: ${subTextColor};
    text-align: left;
  }

  > div:nth-child(4) {
    font-size: 12px;
    color: ${subTextColor};
    text-align: right;
  }
`

export const BrowseDataHeader = styled.div`
  display: grid;
  grid-template-columns: 60px auto;
  grid-gap: 25px;

  > img {
    width: 60px;
    height: 60px;
  }
`

export const BrowseDataHeaderTitle = styled.div`
  margin-top: 11px;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
`

export const BrowseDataHeaderFunded = styled.div`
  color: ${subTextColor};

  > img {
    vertical-align: text-bottom;
    margin-left: 5px;
  }
`

export const BrowseDataReward = styled.div`
  font-size: 48px;
  font-weight: bold;
  letter-spacing: 1px;
  background: -webkit-linear-gradient(45deg, #f23ce3, #6d53f9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  margin-top: 45px;
`

export const BrowseDataOfPremium = styled.div`
  color: ${subTextColor};
  text-align: center;
  font-weight: bold;
`

export const BrowseDataBuy = styled.div`
  border: 1px solid white;
  font-size: 16px;
  border-radius: 40px;
  font-weight: bold;
  text-align: center;
  height: 36px;
  line-height: 36px;
  margin: 60px auto 0 auto;
  width: 210px;
`

export const BrowseDataButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
`

export const BrowseDataDescription = styled.div`
  display: block;
  color: #9090a0;
  margin: 20px auto;
`

export const BrowseDataProgress = styled.div`
  margin-top: 40px;

  > div:nth-child(1) {
    color: #9090a0;
    display: inline-block;
    margin-bottom: 10px;
  }

  > div:nth-child(2) {
    float: right;
    display: inline-block;
    margin-bottom: 10px;
  }
`

export const BrowseDataProgressBar = styled.div`
  width: 100%;
  height: 10px;
  border-radius: 10px;
  background: #0c1232;
`

export const BrowseDataProgressBarInner = styled.div<{ percent: number }>`
  width: ${(props) => props.percent}%;
  height: 10px;
  border-radius: 10px;
  background: linear-gradient(228.93deg, #fe7e00 8.82%, #ff3b00 86.18%);
`
