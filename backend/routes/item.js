const express = require("express")
const router = express.Router()
const models = require("../models")

/*
  GET /item
  買い物リストに入っている商品を新しい順に全件取得する
*/
router.get("/", (req, res) => {
  try {
    models.items.findAll({
      order: [
        ['updated_at', 'DESC'] // updated_atの値で新しい順に並び替える
      ],
      include: [{
        model: models.users, // usersテーブルをJOINする
        required: false // OUTER JOINするため、requiredはfalseにする
      }]
    })
      .then(items => {
        res.status(200).json(items)
      })
  }
  catch (e) {
    console.log(e)
    res.status(500).send("Internal Server Error!")
  }
})

module.exports = router