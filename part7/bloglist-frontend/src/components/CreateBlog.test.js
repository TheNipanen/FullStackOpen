import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlog from './CreateBlog'

test('prop callback is called with proper info when blog is created', async () => {
  const mockHandler = jest.fn()
  const createdMockHandler = jest.fn()

  render(
    <CreateBlog
      callBack={mockHandler}
      setNotification={mockHandler}
      closeForm={mockHandler}
      testCreate={createdMockHandler}
    />
  )

  const inputs = screen.getAllByRole('textbox')
  const createButton = screen.getByText('create')

  const user = userEvent.setup()

  await user.type(inputs[0], 'title')
  await user.type(inputs[1], 'author')
  await user.type(inputs[2], 'url')
  await user.click(createButton)

  expect(createdMockHandler.mock.calls).toHaveLength(1)
  expect(createdMockHandler.mock.calls[0][0].title).toBe('title')
  expect(createdMockHandler.mock.calls[0][0].author).toBe('author')
  expect(createdMockHandler.mock.calls[0][0].url).toBe('url')
})
