const { UserInputError, AuthenticationError } = require('apollo-server')
const { v1: uuid } = require('uuid')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const jwt = require('jsonwebtoken')
const config = require('./config')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const SECRET = config.SECRET

const resolvers = {
  Author: {
    bookCount: async (root) =>
      ((await Author.findById(root.id)).books || []).length,
  },
  Book: {
    author: async (root) => {
      const book = await Book.findById(root.id).populate('author', {
        id: 1,
        name: 1,
        born: 1,
      })
      return book.author
    },
  },
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) =>
      args.genre
        ? Book.find({ genres: { $elemMatch: { $eq: args.genre } } })
        : Book.find({}),
    allAuthors: async () => Author.find({}),
    me: (root, args, context) => {
      return context.currentUser
    },
  },
  Mutation: {
    addBook: async (root, { title, author, published, genres }, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }
      const book = new Book({ title, published, genres, id: uuid() })
      const foundAuthor = await Author.findOne({ name: author })
      if (!foundAuthor) {
        const newAuthor = new Author({
          name: author,
          id: uuid(),
          books: [book.id],
        })
        try {
          const savedAuthor = await newAuthor.save()
          book.author = savedAuthor._id
          await book.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: { title, author, published, genres },
          })
        }
        return book
      }
      book.author = foundAuthor._id
      foundAuthor.books = (foundAuthor.books || []).concat(book.id)
      try {
        await book.save()
        await foundAuthor.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: { title, author, published, genres },
        })
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: book })

      return book
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }
      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }
      author.born = args.setBornTo
      try {
        await author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return author
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
        id: uuid(),
      })

      return user.save().catch((error) => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new UserInputError('wrong credentials')
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, SECRET) }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
    },
  },
}

module.exports = resolvers
