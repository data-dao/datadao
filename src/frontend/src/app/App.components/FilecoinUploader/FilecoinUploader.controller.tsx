import * as PropTypes from 'prop-types'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { backgroundColorDark, primaryColor, textColor } from 'styles'

import { FilecoinUploaderView } from './FilecoinUploader.view'

type FilecoinUploaderProps = {
  callback: (url: string) => void
}

export const FilecoinUploader = ({ callback }: FilecoinUploaderProps) => {
  return <FilecoinUploaderView callback={callback} />
}

FilecoinUploader.propTypes = {
  callback: PropTypes.func.isRequired,
}

FilecoinUploader.defaultProps = {}
