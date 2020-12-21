import { Button } from 'app/App.components/Button/Button.controller'
import { Input } from 'app/App.components/Input/Input.controller'
import * as React from 'react'
import { Link } from 'react-router-dom'

// prettier-ignore
import { CreateStyled } from './Create.style'

export const CreateView = () => {
  const [title, setTitle] = React.useState<string>('')
  const [description, setDescription] = React.useState<string>('')
  const [requirement1, setRequirement1] = React.useState<string>('')

  return (
    <CreateStyled>
      <h1>Create</h1>
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
        name="requirement1"
        placeholder="Requirement 1"
        type="text"
        onChange={(e) => setRequirement1(e.target.value)}
        value={requirement1}
        onBlur={() => {}}
        inputStatus={undefined}
        errorMessage={undefined}
      />
      <Link to="/congrats">
        <Button text="Create" icon="home" />
      </Link>
    </CreateStyled>
  )
}
