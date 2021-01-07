import { Button } from 'app/App.components/Button/Button.controller'
import { Input } from 'app/App.components/Input/Input.controller'
import * as React from 'react'
import { deployDAO } from '../../helpers/datadao'
import { enableWalletProvider, getCachedAccount, getWeb3Provider } from '../../helpers/arc'

// prettier-ignore
import { CreateStyled } from './Create.style'

import ExampleDAO from '../../exampleDSDAO.json'

export const CreateView = () => {
  const [title, setTitle] = React.useState<string>('')
  const [description, setDescription] = React.useState<string>('')
  const [requiredAmount, setRequiredAmount] = React.useState<string>('')
  const [requirement1, setRequirement1] = React.useState<string>('')
  const [requirement2, setRequirement2] = React.useState<string>('')
  const [exampleDataUrl, setExampleDataUrl] = React.useState<string>('')
  const [purchasePrice, setPurchasePrice] = React.useState<string>('')
  const [reviewPrice, setReviewPrice] = React.useState<string>('')

  return (
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
          let success = false
          if (!getWeb3Provider()) {
            console.log('Connecting to wallet...')
            success = await enableWalletProvider({
              showNotification: undefined,
              suppressNotifyOnSuccess: true,
            })
          }
          if (success) {
            const sender = getCachedAccount()
            const dao = Object.assign(ExampleDAO, {
              founders: [
                {
                  address: sender,
                  tokens: 0,
                  reputation: 1000,
                },
              ],
            })
            console.log('about to deployDAO', dao)
            await deployDAO(dao)
          } else {
            alert('Fail to Connect to your wallet')
          }
        }}
      />
    </CreateStyled>
  )
}
