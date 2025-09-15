const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: "boa tarde a todos",
        author: "Gabriel C.",
        url: "www.gabizaoBRUTAL.com",
        likes: 100
    },
    {
        title: "boa noite!!!!!",
        author: "Gabriel Claudino de Souza",
        url: "www.gabizaoA-LENDA.com",
        likes: 1111
    }
]

const initialUsers = [
    {
        username: "gabizao",
        name: "Gabriel"
    },
    {
        username: "gabizaoApenas",
        name: "gabriel c."
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}


module.exports = {
    initialBlogs, blogsInDb, initialUsers, usersInDb
}