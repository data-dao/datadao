import styled from 'styled-components/macro'

// prettier-ignore
import { backgroundColorDark, backgroundColorLight, backgroundTextColor, bgTextColor, HURME_GEOMETRIC, primaryColor, secondaryColor, subTextColor, textColor } from '../../../styles'

export const HeaderStyled = styled.div`
  z-index: 1;
  position: fixed;
  top: 0;
  width: 100vw;
`

export const HeaderMain = styled.div`
  height: 50px;
  background-color: ${backgroundColorLight};
  width: 100vw;
  /* backdrop-filter: saturate(180%) blur(5px); */
`

export const HeaderTriangle = styled.div`
  position: absolute;
  top: 50px;
  left: calc(50vw - 70px);
  width: 0;
  height: 0;
  border-left: 70px solid transparent;
  border-right: 70px solid transparent;
  border-top: 40px solid ${backgroundColorLight};
`

export const HeaderLogo = styled.div`
  position: absolute;
  top: 0;
  left: calc(50vw - 26px);

  img {
    height: 60px;
    margin-top: 10px;
  }
`

export const HeaderLoggedOut = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: grid;
  grid-template-columns: 80px 120px;
  grid-gap: 20px;
  padding: 6px 9px;
`

export const HeaderDoc = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 6px 9px;
`

export const HeaderLoggedIn = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: grid;
  grid-template-columns: 53px 1px 62px;

  a {
    height: 50px;
  }

  .header-icon {
    stroke: ${subTextColor};
    width: 22px;
    height: 22px;
    margin: 14px;
  }

  .separator {
    fill: ${backgroundTextColor};
    width: 1px;
    height: 20px;
    margin: 15px 0;
  }
`

export const HeaderNotificationCount = styled.div`
  position: absolute;
  top: 11px;
  margin-left: 26px;
  width: 20px;
  height: 14px;
  font-size: 9px;
  line-height: 14px;
  font-family: '${HURME_GEOMETRIC}';
  font-weight: bold;
  border-radius: 12px;
  border: 1px solid ${backgroundColorDark};
  text-align: center;
  background-color: ${primaryColor};
  color: ${textColor};

  &.secondary {
    background-color: ${secondaryColor};
    color: ${backgroundColorLight};
  }
`
export const HeaderMenuItem = styled.div`
  position: relative;
  color: ${subTextColor};
  line-height: 50px;
  font-size: 14px;
  font-weight: 700;
  display: inline-block;
  padding: 0 20px;

  &.login {
    background-color: ${primaryColor};
    color: ${bgTextColor};
    width: 128px;
    display: grid;
    grid-template-columns: auto 50px;
    text-align: right;

    > div {
      line-height: 50px;
    }

    > svg {
      height: 28px;
      width: 28px;
      margin: 11px;
      stroke: ${bgTextColor};
    }
  }

  @media (max-width: 1440px) {
    padding: 0 10px;
  }
`

export const HeaderProfilePicture = styled.img`
  margin: 8px 0 0 13px;
  width: 34px;
  height: 34px;
  border-radius: 25px;
  cursor: pointer;
`

export const HeaderMenu = styled.div`
  position: absolute;
  top: 15px;
  left: 50px;
  z-index: 1;

  > a > img {
    height: 20px;
  }

  @media (max-width: 900px) {
    display: none;
  }
`
