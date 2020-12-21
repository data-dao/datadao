import * as PropTypes from 'prop-types'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { backgroundColorDark, primaryColor, textColor } from 'styles'

import { BUTTON, ButtonTypes } from './Button.constants'
import { ButtonView } from './Button.view'

type ButtonProps = {
  text: string
  icon?: string
  color: string
  textColor: string
  onClick?: () => void
  type: ButtonTypes
  loading: boolean
  loadingText: string
  disabled: boolean
}

export const Button = ({
  text,
  icon,
  color,
  textColor,
  onClick,
  type,
  loading,
  loadingText,
  disabled,
}: ButtonProps) => {
  const [clicked, setClicked] = useState(false)

  const clickCallback = () => {
    setClicked(true)
    // setTimeout(() => setClicked(false), 1000)
    if (onClick) onClick()
  }

  useEffect(() => {
    let timeout: any
    if (clicked)
      timeout = setTimeout(() => {
        setClicked(false)
      }, 1000)
    return () => {
      clearTimeout(timeout)
    }
  }, [clicked])

  return (
    <ButtonView
      text={text}
      icon={icon}
      color={color}
      textColor={textColor}
      clicked={clicked}
      clickCallback={clickCallback}
      type={type}
      loading={loading}
      loadingText={loadingText}
      disabled={disabled}
    />
  )
}

Button.propTypes = {
  text: PropTypes.string.isRequired,
  icon: PropTypes.string,
  color: PropTypes.string,
  textColor: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string,
  loading: PropTypes.bool,
  loadingText: PropTypes.string,
  disabled: PropTypes.bool,
}

Button.defaultProps = {
  icon: undefined,
  color: primaryColor,
  textColor: textColor,
  type: BUTTON,
  loading: false,
  loadingText: 'Loading...',
  disabled: false,
}
