const express = require("express")
const app = express()
const mongoose = require("mongoose")
const articleRouter = require("./routes/articles")
const Article = require("./models/Article")
const methodOverride = require("method-override")

mongoose.connect("mongodb://localhost/blog", {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log("DB working")
})

app.set('view engine', 'ejs')
app.use(methodOverride('_method'))

app.use(express.urlencoded({ extended: false }))
app.use("/articles", articleRouter)


app.get("/", async (req, res) => {
    const articles = await Article.find().lean()
    res.render("articles/index", { articles: articles })
})

app.listen(8000, () => { console.log("Hello, Express!") })