import { DataDao } from 'helpers/exampleDataDaos'
import * as React from 'react'
import { ModalCard, ModalMask, ModalStyled } from 'styles'

import { Input } from '../Input/Input.controller'
// prettier-ignore
import { LiquidityModalBuy, LiquidityModalCard, LiquidityModalInputs, LiquidityModalReward, LiquidityModalRewardEther, LiquidityModalRewardTitle } from './LiquidityModal.style'

type LiquidityModalViewProps = {
  showing: boolean
  data?: DataDao
  hideCallback: () => void
  buyCallback: (dataId: string, premium: number) => void
}

export const LiquidityModalView = ({ showing, data, hideCallback, buyCallback }: LiquidityModalViewProps) => {
  const [premium, setPremium] = React.useState<any>()
  const [error, setError] = React.useState<any>()

  React.useEffect(() => {
    setPremium('1')
  }, [showing])

  return (
    <ModalStyled showing={showing}>
      {showing && (
        <>
          <ModalMask showing={showing} onClick={() => hideCallback()} />
          <ModalCard>
            <h1>Provide Liquidity</h1>
            <LiquidityModalCard>
              {data?.name}
              <LiquidityModalInputs>
                <Input
                  icon="ether"
                  name="ether"
                  placeholder="Premium"
                  type="number"
                  onChange={(e) => setPremium(e.target.value)}
                  value={premium}
                  onBlur={() => {}}
                  inputStatus={undefined}
                  errorMessage={undefined}
                />
              </LiquidityModalInputs>
              <LiquidityModalReward>
                <LiquidityModalRewardTitle>Estimated anual reward</LiquidityModalRewardTitle>
                <LiquidityModalRewardEther>
                  Ξ{((parseFloat(premium) || 0) * ((data?.price || 0) / 100)).toFixed(2)}
                </LiquidityModalRewardEther>
              </LiquidityModalReward>
              <LiquidityModalBuy onClick={() => buyCallback(data?.id as string, premium)}>
                Send Ξ{(parseFloat(premium) || 0).toFixed(2)}
              </LiquidityModalBuy>
            </LiquidityModalCard>
          </ModalCard>
        </>
      )}
    </ModalStyled>
  )
}
