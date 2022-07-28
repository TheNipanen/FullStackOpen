const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, current) => sum + current.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((favorite, current) => {
    return current.likes > favorite.likes ?
      { title: current.title, author: current.author, likes: current.likes } :
      { title: favorite.title, author: favorite.author, likes: favorite.likes }
  }, 
  { title: '', author: '', likes: -1 })
}

const mostBlogs = (blogs) => {
  const amounts = {}
  for (const blog of blogs) {
    const author = blog.author
    if (author in amounts) {
      amounts[author] += 1
    } else {
      amounts[author] = 1
    }
  }

  const most = {
    author: '',
    blogs: 0
  }
  for (const author in amounts) {
    if (amounts[author] > most.blogs) {
      most.author = author
      most.blogs = amounts[author]
    }
  }
  return most
}

const mostLikes = (blogs) => {
  const amounts = {}
  for (const blog of blogs) {
    const author = blog.author
    if (author in amounts) {
      amounts[author] += blog.likes
    } else {
      amounts[author] = blog.likes
    }
  }

  const most = {
    author: '',
    likes: -1
  }
  for (const author in amounts) {
    if (amounts[author] > most.likes) {
      most.author = author
      most.likes = amounts[author]
    }
  }
  return most
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
