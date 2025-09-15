const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

const Blog = require('../models/blog')
const { initialBlogs } = require('./test_helper')
const blog = require('../models/blog')
const User = require('../models/user')


beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)

    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)
})

describe('blogs test', () => {

    test('blogs are returned as json and correct amount', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(initialBlogs.length)
    })

    test('blog identifier is id', async () => {
        const response = await api.get('/api/blogs')

        expect(response.body[0].id).toBeDefined()
    })

    test('a new blog can be created', async () => {
        const newBlog = {
            title: "muito boa noite",
            author: "Gabriel",
            url: "www.sefoda.com",
            likes: 92
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

        const titles = blogsAtEnd.map(b => b.title)
        expect(titles).toContain('muito boa noite')
    })


    test('a blog with no likes can be created', async () => {

        const newBlog = {
            title: "muito boa tarde",
            author: "Gabriel",
            url: "www.sefoda.com",
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd.at(-1).likes).toEqual(0)
    })


    test('title and url must be defined', async () => {

        const newBlog = {
            author: "Gabriel Claudino",
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('a blog can be deleted', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(
            helper.initialBlogs.length - 1
        )

        const contents = blogsAtEnd.map(b => b.title)

        expect(contents).not.toContain(blogToDelete.title)
    })

    test('the blogs likes can be updated', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToBeUpdeted = blogsAtStart[0]

        const newLikes = (blogToBeUpdeted.likes || 0) + 10

        await api
            .put(`/api/blogs/${blogToBeUpdeted.id}`)
            .send({ likes: newLikes })
            .expect(200)

        const blogsAtEnd = await helper.blogsInDb()
        const updated = blogsAtEnd.find(b => b.id === blogToBeUpdeted.id)

        expect(updated.likes).toEqual(newLikes)
    })

})

describe('users tests', () => {

    test('fails with statuscode 400 if username is empty', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            name: "Gabriel",
            password: "bababa"
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtStart.length).toEqual(usersAtEnd.length)
    })

    test('fails with statuscode 400 if password is empty', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "gabizao123123",
            name: "Gabriel"
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtStart.length).toEqual(usersAtEnd.length)
    })

    test('fails with statuscode 400 if username is shorter than 3 characters', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "ga",
            name: "Gabriel"
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtStart.length).toEqual(usersAtEnd.length)
    })

    test('fails with statuscode 400 if password is shorter than 3 characters', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            password: "10",
            name: "Gabriel"
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtStart.length).toEqual(usersAtEnd.length)
    })

    test('fails with statuscode 400 if username not unique', async () => {

        const usersAtStart = await helper.usersInDb()
        const userSelected = usersAtStart[0]

        const newUser = {
            username: userSelected.username,
            name: "test",
            password: "test"
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtStart.length).toEqual(usersAtEnd.length)
    })

    test('a valid user can be created', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "test101010",
            password: "testtest",
            name: "test"
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtStart.length).not.toEqual(usersAtEnd.length)
    })
})


afterAll(async () => {
    await mongoose.connection.close()
})