const express = require("express")
const router = express.Router()
const models = require("../models")

/*
  GET /user
  登録されているユーザーを全件取得する
*/
router.get("/", (req, res) => {
  try {
    models.users.findAll({
      order: [
        ["id", "ASC"]
      ]
    })
      .then(users => {
        res.json(users).end()
      })
      .catch((e) => {
        console.log(e)
        res.status(500).send("Internal Server Error")
      })
  }
  catch (e) {
    console.log(e)
    res.status(500).send("Internal Server Error!")
  }
})

module.exports = router