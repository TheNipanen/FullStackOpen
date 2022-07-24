const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Bilbo the gamer',
    author: 'Bilbo Baggins',
    url: 'bilbothegamer.com,',
    likes: 765
  },
  {
    title: 'Jesus stole my dogs',
    author: 'Dildo Daggins',
    url: 'jesusstolemydogs.org',
    likes: 15000
  }
]

const user = {
  username: 'Bagger420',
  name: 'Bilbo Baggins',
  password: 'bilborino17'
}
let token
let userId
beforeAll(async () => {
  await User.deleteMany({})
  const userRes = await api.post('/api/users').send(user)
  const loginRes = await api.post('/api/login').send({ username: user.username, password: user.password })
  token = loginRes.body.token
  userId = userRes.body.id
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs.map(b => {return { ...b, user: userId }}))
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .set({ Authorization: `Bearer ${token}`})
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs').set({ Authorization: `Bearer ${token}`})
  expect(response.body).toHaveLength(initialBlogs.length)
})

test('blogs are identified with "id" property', async () => {
  const response = await api.get('/api/blogs').set({ Authorization: `Bearer ${token}`})
  expect(response.body[0].id).toBeDefined()
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Hello dude',
    author: 'Jesus',
    url: 'hellodude.dude',
    likes: 2
  }

  await api.post('/api/blogs').send(newBlog).set({ Authorization: `Bearer ${token}`}).expect(201).expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs').set({ Authorization: `Bearer ${token}`})
  expect(response.body).toHaveLength(initialBlogs.length + 1)
})

test('likes gets defaulted to zero', async () => {
  const newBlog = {
    title: 'Hello brude',
    author: 'Bro Jesus',
    url: 'hellobrude.brude'
  }

  await api.post('/api/blogs').send(newBlog).set({ Authorization: `Bearer ${token}`}).expect(201).expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs').set({ Authorization: `Bearer ${token}`})
  expect(response.body[initialBlogs.length].likes).toBe(0)
})

test('blog must contain both title and url', async () => {
  const newBlog1 = {
    author: 'Bagger Bilbo'
  }
  const newBlog2 = {
    title: 'Bagging in Mordor',
    author: 'Bagger Bilbo'
  }
  const newBlog3 = {
    author: 'Bagger Bilbo',
    url: 'bagginginmordor.sh'
  }

  await api.post('/api/blogs').send(newBlog1).set({ Authorization: `Bearer ${token}`}).expect(400)
  await api.post('/api/blogs').send(newBlog2).set({ Authorization: `Bearer ${token}`}).expect(400)
  await api.post('/api/blogs').send(newBlog3).set({ Authorization: `Bearer ${token}`}).expect(400)
})

test('deleting blog by id works', async () => {
  const response = await api.get('/api/blogs').set({ Authorization: `Bearer ${token}`})
  const id = response.body[0].id
  await api.delete(`/api/blogs/${id}`).set({ Authorization: `Bearer ${token}`}).expect(204)

  const response2 = await api.get('/api/blogs').set({ Authorization: `Bearer ${token}`})
  expect(response2.body).toHaveLength(initialBlogs.length - 1)
})

test('deleting blog by false id returns bad request', async () => {
  await api.delete('/api/blogs/1').set({ Authorization: `Bearer ${token}`}).expect(400)
})

test('updating blog by id works', async () => {
  const response = await api.get('/api/blogs').set({ Authorization: `Bearer ${token}`})
  const blog = response.body[0]
  await api.put(`/api/blogs/${blog.id}`).send({ ...blog, likes: 1 }).set({ Authorization: `Bearer ${token}`}).expect(200)

  const response2 = await api.get('/api/blogs').set({ Authorization: `Bearer ${token}`})
  expect(response2.body).toHaveLength(initialBlogs.length)
  expect(response2.body[0].likes).toBe(1)
})

test('updating blog by false id returns bad request', async () => {
  await api.put('/api/blogs/1').send(initialBlogs[0]).set({ Authorization: `Bearer ${token}`}).expect(400)
})

test('adding blog without token does not work', async () => {
  const newBlog = {
    title: 'Hello dude',
    author: 'Jesus',
    url: 'hellodude.dude',
    likes: 2
  }

  const result = await api.post('/api/blogs').send(newBlog).expect(401).expect('Content-Type', /application\/json/)
  expect(result.body.error).toContain('invalid token')
})

afterAll(() => {
  mongoose.connection.close()
})
