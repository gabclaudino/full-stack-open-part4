const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {

    const likes = blogs.reduce((total, blog) => {
        return total + blog.likes
    }, 0)

    return blogs.length === 0 ? 0 : likes
}

const favoriteBlog = (blogs) => {
    let favorite = {
        title: "",
        author: "",
        likes: 0,
    }

    for (const blog of blogs) {
        if (blog.likes >= favorite.likes) {
            favorite = {
                title: blog.title,
                author: blog.author,
                likes: blog.likes
            }
        }
    }

    return favorite
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
}