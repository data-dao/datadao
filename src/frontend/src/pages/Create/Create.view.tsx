import { Button } from 'app/App.components/Button/Button.controller'
import { FilecoinUploader } from 'app/App.components/FilecoinUploader/FilecoinUploader.controller'
import { Input } from 'app/App.components/Input/Input.controller'
import { Button as AButton, notification, Result, Spin } from 'antd';
import { create } from 'domain'
import * as React from 'react'
import { Link } from 'react-router-dom'
import Web3 from 'web3'

import { CreateProps } from './Create.controller'
import ExampleDAO from '../../exampleDSDAO.json'
import { enableWalletProvider, getCachedAccount, getWeb3Provider } from '../../helpers/arc'
import { createMasterDataToken, DAOMetadata, DataDAOInfo, deployDAO } from '../../helpers/datadao'
// prettier-ignore
import { CreateStyled } from './Create.style'

export const CreateView = ({drizzle, drizzleState}: CreateProps) => {
  const [title, setTitle] = React.useState<string>('')
  const [description, setDescription] = React.useState<string>('')
  const [symbol, setSymbol] = React.useState<string>('')
  const [requiredAmount, setRequiredAmount] = React.useState<string>('')
  const [requirement1, setRequirement1] = React.useState<string>('')
  const [requirement2, setRequirement2] = React.useState<string>('')
  const [exampleDataUrl, setExampleDataUrl] = React.useState<string>('')
  const [purchasePrice, setPurchasePrice] = React.useState<string>('')
  const [reviewPrice, setReviewPrice] = React.useState<string>('')
  const [processing, toggleProcess] = React.useState<boolean>(false)
  const [message, setMessage] = React.useState<string>('Processing...')
  const [daoURI, setDAOURI] = React.useState<string>('')

  return !daoURI ? (
    <Spin spinning={processing} size="large" tip={message}>
      <CreateStyled>
        <h1>Create a new Data DAO</h1>
        <div style={{ color: '#989FBA' }}>A new DataDAO is a a new Dataset request.</div>
        <h2>DAO Infos</h2>
        <Input
          icon="ether"
          name="title"
          placeholder="Title"
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          onBlur={() => {}}
          inputStatus={undefined}
          errorMessage={undefined}
        />
        <Input
          icon="ether"
          name="description"
          placeholder="Description"
          type="text"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          onBlur={() => {}}
          inputStatus={undefined}
          errorMessage={undefined}
        />
        <Input
          icon="ether"
          name="symbol"
          placeholder="DAO Symbol"
          type="text"
          onChange={(e) => setSymbol(e.target.value.substring(0, 4).toUpperCase())}
          value={symbol}
          onBlur={() => {}}
          inputStatus={undefined}
          errorMessage={undefined}
        />

        <h2>Data being requested</h2>
        <Input
          icon="ether"
          name="requiredAmount"
          placeholder="Required amount, e.g. 5000"
          type="text"
          onChange={(e) => setRequiredAmount(e.target.value)}
          value={requiredAmount}
          onBlur={() => {}}
          inputStatus={undefined}
          errorMessage={undefined}
        />
        <Input
          icon="ether"
          name="requirement1"
          placeholder="Requirement 1"
          type="text"
          onChange={(e) => setRequirement1(e.target.value)}
          value={requirement1}
          onBlur={() => {}}
          inputStatus={undefined}
          errorMessage={undefined}
        />
        <Input
          icon="ether"
          name="requirement2"
          placeholder="Requirement 2"
          type="text"
          onChange={(e) => setRequirement2(e.target.value)}
          value={requirement2}
          onBlur={() => {}}
          inputStatus={undefined}
          errorMessage={undefined}
        />

        <h2>Sample data</h2>
        <FilecoinUploader callback={(url: string) => setExampleDataUrl(url)} />
        <Input
          icon="ether"
          name="exampleDataUrl"
          placeholder="Example data URL"
          type="text"
          onChange={(e) => setExampleDataUrl(e.target.value)}
          value={exampleDataUrl}
          onBlur={() => {}}
          inputStatus={undefined}
          errorMessage={undefined}
        />

        <h2>Stake amount</h2>
        <div style={{ marginBottom: '20px', color: '#989FBA' }}>
          Stake the amount you wish to pay for this Dataset. The coins will be locked in the DAO treasury that you
          control, and will only be released to the contributers once you confirm you are ready to purchase the Dataset
        </div>
        <Input
          icon="ether"
          name="purchasePrice"
          placeholder="Purchase Price in $DAI"
          type="text"
          onChange={(e) => setPurchasePrice(e.target.value)}
          value={purchasePrice}
          onBlur={() => {}}
          inputStatus={undefined}
          errorMessage={undefined}
        />

        <div style={{ marginBottom: '20px', color: '#989FBA' }}>
          This is the amount you are willing to pay for a validator to review the dataset and confirm it meets the
          requierments
        </div>
        <Input
          icon="ether"
          name="reviewPrice"
          placeholder="Review Price in $DAI"
          type="text"
          onChange={(e) => setReviewPrice(e.target.value)}
          value={reviewPrice}
          onBlur={() => {}}
          inputStatus={undefined}
          errorMessage={undefined}
        />

        <Button
          text="Create"
          icon="home"
          onClick={async () => {
            toggleProcess(true)
            let success = false
            if (!exampleDataUrl) { 
              notification.open({
                message: 'Process Failed',
                description: 'You need to specify an example Data File',
              });
              toggleProcess(false)
              return;
            }
            if (!getWeb3Provider()) {
              console.log('Connecting to wallet...')
              setMessage('Connecting to wallet...')
              success = await enableWalletProvider({
                showNotification: undefined,
                suppressNotifyOnSuccess: true,
              })
            }
            if (success) {
              const sender = getCachedAccount()
              const dao = Object.assign(ExampleDAO, {
                orgName: title,
                tokenName: `${symbol}DAO Token`,
                tokenSymbol: `${symbol}DAO`,
                founders: [
                  {
                    address: sender,
                    tokens: 0,
                    reputation: 1000,
                  },
                ],
              })
              console.log('about to deployDAO', dao)
              setMessage('Creating a new DAO (1/2)...')
              const daoInfo: DataDAOInfo | undefined = await deployDAO(dao)

              if (daoInfo) {

                // Creating MasterDataToken
                const daoMetadata: DAOMetadata = {
                  title,
                  description,
                  requirements: {
                      records: Number.parseInt(requiredAmount),
                  },
                  customRequirements: [
                      {
                          label: 'Requirement 1',
                          description: requirement1
                      },
                      {
                          label: 'Requirement 2',
                          description: requirement2
                      }
                  ],
                  sampleData: exampleDataUrl,
                  purchasePrice: Web3.utils.toWei(purchasePrice.toString() || '0'),
                  reviewPrice: Web3.utils.toWei(reviewPrice.toString() || '0'),
                  daoInfo: daoInfo!.daoInfo,
                  alchemyURI: daoInfo!.alchemyURI
                }
                
                setMessage('Creating DAO (2/2)...')
                try {
                  success = await createMasterDataToken(`${symbol} Token`, symbol, daoMetadata, { drizzle, drizzleState })
                } catch (e) {
                  success = false;
                }

                if (success) {
                  setDAOURI(`/details/${daoInfo.daoInfo.Avatar}`);
                  // setDAOURI(`/details/dao0`)
                }
              } else {
                success = false
              }
            } else {
              alert('Failed to Connect to your wallet')
              notification.open({
                message: 'Process Failed',
                description: 'Failed to Connect to your wallet',
              });
              toggleProcess(false)
            }

            if (!success) {
              notification.open({
                message: 'Process Failed',
                description: 'Faied to Create a new DataDAO',
              });
            }
            toggleProcess(false)
            setMessage('Processing...')
          }}
        />
      </CreateStyled>
    </Spin>
  ): (
    <Result
      status="success"
      title="Congratulations!"
      subTitle="Your new DataDAO has been created!"
      extra={[
        <Link to={daoURI}>
          <AButton type="primary" key="console">
            Go Console
          </AButton>
        </Link>,
      ]}
    />
  )
}
