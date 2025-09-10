const Blog = require('../models/blog')

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

// const nonExistingId = async () => {
//     const note = new Note({ content: 'willremovethissoon' })
//     await note.save()
//     await note.deleteOne()

//     return note._id.toString()
// }

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs, blogsInDb
}