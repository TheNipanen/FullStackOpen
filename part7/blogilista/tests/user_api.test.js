const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const User = require('../models/user')

describe('no incorrect users are created', () => {
  const existingUser = {
    username: 'exists',
    name: 'exists',
    password: 'exists'
  }

  beforeAll(async () => {
    await User.deleteMany({})
    await api.post('/api/users').send(existingUser)
  })

  test('user with too short username is not created', async () => {
    const shortUsername = {
      username: 's',
      name: 'sss',
      password: 'sss'
    }

    const result = await api.post('/api/users').send(shortUsername).expect(400).expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('User validation failed: username: Path `username` (`s`) is shorter than the minimum allowed length (3).')
  })

  test('user with too short password is not created', async () => {
    const shortPassword = {
      username: 'sss',
      name: 'sss',
      password: 's'
    }

    const result = await api.post('/api/users').send(shortPassword).expect(400).expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('password must have a length of at least 3')
  })

  test('user with existing username is not created', async () => {
    const result = await api.post('/api/users').send(existingUser).expect(400).expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('username must be unique')
  })
})