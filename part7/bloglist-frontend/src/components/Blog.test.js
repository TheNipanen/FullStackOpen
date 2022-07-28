import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'Good Games',
  author: 'Gamer Dude',
  url: 'goodgames.com',
  likes: 75000,
  user: {
    id: '123',
    username: 'gamerdude75',
    name: 'Gamer Dude',
  },
}

test('renders only title and author by default', () => {
  const mockHandler = jest.fn()

  render(
    <Blog
      key={blog.id}
      blog={blog}
      callBack={mockHandler}
      setNotification={mockHandler}
      user={blog.user}
    />
  )

  screen.getByText(`${blog.title} ${blog.author}`)
  const url = screen.queryByText(`${blog.url}`)
  expect(url).toBeNull()
  const likes = screen.queryByText(`${blog.likes}`)
  expect(likes).toBeNull()
})

test('title, author, url, and likes are rendered after clicking view button', async () => {
  const mockHandler = jest.fn()

  render(
    <Blog
      key={blog.id}
      blog={blog}
      callBack={mockHandler}
      setNotification={mockHandler}
      user={blog.user}
    />
  )

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  screen.getByText(`${blog.title} ${blog.author}`)
  screen.getByText(`${blog.url}`)
  screen.getByText(`${blog.likes}`)
})

test('callback is fired twice, when like button is clicked twice', async () => {
  const mockHandler = jest.fn()

  render(
    <Blog
      key={blog.id}
      blog={blog}
      callBack={mockHandler}
      setNotification={mockHandler}
      user={blog.user}
      likeMock={mockHandler}
    />
  )

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)
  expect(mockHandler.mock.calls).toHaveLength(2)
})
