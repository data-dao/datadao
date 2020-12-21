import * as PropTypes from 'prop-types'
import * as React from 'react'

import { ButtonTypes } from './Button.constants'
import { ButtonIcon, ButtonLoadingIcon, ButtonStyled, ButtonText } from './Button.style'

type ButtonViewProps = {
  text: string
  icon?: string
  color: string
  textColor: string
  clickCallback: () => void
  clicked: boolean
  type: ButtonTypes
  loading: boolean
  loadingText: string
  disabled: boolean
}

export const ButtonView = ({
  text,
  icon,
  color,
  textColor,
  clickCallback,
  clicked,
  type,
  loading,
  loadingText,
  disabled,
}: ButtonViewProps) => {
  let buttonClasses = ''
  if (clicked) buttonClasses += ' clicked'
  if (loading) buttonClasses += ' loading'
  return (
    <ButtonStyled
      color={color}
      textColor={textColor}
      className={buttonClasses}
      onClick={() => clickCallback()}
      type={type}
      disabled={disabled}
    >
      <ButtonText>
        {loading ? (
          <>
            <ButtonLoadingIcon>
              <use xlinkHref="/icons/sprites.svg#circle" />
            </ButtonLoadingIcon>
            {loadingText}
          </>
        ) : (
          <>
            {icon && (
              <ButtonIcon>
                <use xlinkHref={`/icons/sprites.svg#${icon}`} />
              </ButtonIcon>
            )}
            {text}
          </>
        )}
      </ButtonText>
    </ButtonStyled>
  )
}

ButtonView.propTypes = {
  text: PropTypes.string.isRequired,
  icon: PropTypes.string,
  color: PropTypes.string.isRequired,
  textColor: PropTypes.string.isRequired,
  clickCallback: PropTypes.func.isRequired,
  clicked: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  loadingText: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
}

ButtonView.defaultProps = {}
