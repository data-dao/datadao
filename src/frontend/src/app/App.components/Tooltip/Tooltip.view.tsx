import * as PropTypes from 'prop-types'
import * as React from 'react'

import { TooltipStyled, TooltipMessage } from './Tooltip.style'

type TooltipViewProps = {
  message: string
  children: any
  showing: boolean
  showCallback: () => void
  hideCallback: () => void
}

export const TooltipView = ({ message, children, showing, showCallback, hideCallback }: TooltipViewProps) => {
  return (
    <TooltipStyled onMouseEnter={() => showCallback()} onMouseLeave={() => hideCallback()}>
      {children}
      {showing && (
        <TooltipMessage>
          {message.split('<br />').map((item, i) => {
            return <p key={i}>{item}</p>
          })}
        </TooltipMessage>
      )}
    </TooltipStyled>
  )
}

TooltipView.propTypes = {
  message: PropTypes.string.isRequired,
  showing: PropTypes.bool,
  showCallback: PropTypes.func.isRequired,
  hideCallback: PropTypes.func.isRequired,
}

TooltipView.defaultProps = {
  showing: false,
}
