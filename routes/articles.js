const express = require("express")
const Article = require("../models/Article")
const router = express.Router()
const mongoose = require("mongoose")
router.get("/", (req, res) => {
    res.send("A criatividade tá ruim")
})

router.get("/view/:id", async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render("articles/show", {article: article})
})

router.get("/view/edit/:id", async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render("articles/edit", { article: article })
})

router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect('view/edit'))

function saveArticleAndRedirect(path) {
    return async (req, res) => {
      let article = req.article
      article.title = req.body.title
      article.description = req.body.description
      article.markdown = req.body.markdown
      try {
        article = await article.save()
        res.redirect(`/articles/view/${article.id}`)
      } catch (e) {
        res.render(`articles/${path}`, { article: article })
      }
    }
  }

router.delete("/view/:id", async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect("/")
})

router.post("/", async (req, res) => {
    let article = new Article({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown
    })
    try{
        article = await article.save()//Salvamento de posts assíncrono
        res.redirect(`/articles/view/${article.id}`)
        console.log("Salvo com sucesso")
    } catch(e) {
        res.render('articles/new', { article: article })
        console.log(e)
    }
})

router.get("/new", (req, res) => {
    res.render("articles/new")
})

module.exports = router