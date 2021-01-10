import * as PropTypes from 'prop-types'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { backgroundColorDark, primaryColor, textColor } from 'styles'

import { FilecoinUploaderView } from './FilecoinUploader.view'

export interface IFile {
  checksum?: string
  contentLength: string
  contentType: string
  encoding?: string
  compression?: string
}

type FilecoinUploaderProps = {
  callback: (url: string, file: IFile) => void
}

export const FilecoinUploader = ({ callback }: FilecoinUploaderProps) => {
  return <FilecoinUploaderView callback={callback} />
}

FilecoinUploader.propTypes = {
  callback: PropTypes.func.isRequired,
}

FilecoinUploader.defaultProps = {}
