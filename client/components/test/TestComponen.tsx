import React from 'react'

type TestComponentProps = {
  name: string;
}

const TestComponent = ({ name  }:any) => {
  return (
    <div>Hello {name}</div>
  )
}

export default TestComponent