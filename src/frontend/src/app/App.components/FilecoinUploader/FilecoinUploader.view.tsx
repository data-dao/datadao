import { notification } from 'antd';
import { Buckets, Identity, KeyInfo, PrivateKey, PushPathResult, UserAuth, WithKeyInfoOptions } from '@textile/hub'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import Dropzone from 'react-dropzone'

import { FilecoinUploaderStyled, FilecoinUploaderZone } from './FilecoinUploader.style'
import { IFile  } from './FilecoinUploader.controller'

type FilecoinUploaderViewProps = {
  callback: (url: string, file: IFile) => void
}

export const FilecoinUploaderView = ({ callback }: FilecoinUploaderViewProps) => {
  const [loading, setLoading] = React.useState(false)

  const onDrop = async (acceptedFiles: File[]) => {
    const accepted = acceptedFiles[0]
    if (accepted) {
      setLoading(true)
      console.log(accepted)

      const identity = PrivateKey.fromRandom()
      const buckets = await Buckets.withKeyInfo(
        {
          key: 'bx7xkt2exxiwwwceafxo2xv2ax4',
        },
        {
          debug: false,
        },
      )
      await buckets.getToken(identity)

      const buck = await buckets.getOrCreate('io.textile.dropzone')
      if (!buck.root) {
        throw new Error('Failed to open bucket')
      }

      const raw = await buckets.pushPath(buck.root.key, accepted.name, accepted.stream())
      console.log(raw)

      setLoading(false)

      callback(
        `https://hub.textile.io/thread/bafksgexwptr5rkchavbhxfahnhvmpbxy5k7yjclfvmbkp4sxcqok77a/buckets/bafzbeib4qr3v42gsfdxsfajjn3dgckbc3vj3mqz5avrui7j4rac7th73xm/${accepted.name}`,
        {
          contentLength: accepted.size.toString(),
          contentType: accepted.type, 
        }
      )
      // const links = await buckets.links(buck.root.key)
      // console.log(links)
    } else {
      notification.open({
        message: 'File Upload Failed!',
        description: 'File format not supported',
      });
    }
  }

  return (
    <FilecoinUploaderStyled>
      {loading ? (
        <div>Uploading...</div>
      ) : (
        <Dropzone
          onDrop={onDrop}
          accept={'image/jpeg, image/png, image/gif, application/json, application/xml, text/csv'}
          maxSize={200000000000}
          multiple={true}
        >
          {({ getRootProps, getInputProps }) => (
            <div className="dropzone" {...getRootProps()}>
              <input {...getInputProps()} />
              <FilecoinUploaderZone>
                <svg>
                  <use xlinkHref="/icons/sprites.svg#upload" />
                </svg>
                <div>Upload data with Filecoin</div>
                <div>(JPG/PNG/GIF/JSON/XML/CSV)</div>
              </FilecoinUploaderZone>
            </div>
          )}
        </Dropzone>
      )}
    </FilecoinUploaderStyled>
  )
}

FilecoinUploaderView.propTypes = {
  callback: PropTypes.func.isRequired,
}

FilecoinUploaderView.defaultProps = {}
