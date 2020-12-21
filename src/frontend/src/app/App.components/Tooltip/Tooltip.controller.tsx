import * as PropTypes from 'prop-types'
import * as React from 'react'
import { useState } from 'react'

import { TooltipView } from './Tooltip.view'

type TooltipProps = {
  message: string
  children: any
}

export const Tooltip = ({ message, children }: TooltipProps) => {
  const [showing, setShowing] = useState(false)

  const showCallback = () => setShowing(true)

  const hideCallback = () => setShowing(false)

  return (
    <TooltipView
      showing={showing}
      showCallback={showCallback}
      hideCallback={hideCallback}
      message={message}
      children={children}
    />
  )
}

Tooltip.propTypes = {
  message: PropTypes.string.isRequired,
}

Tooltip.defaultProps = {}
