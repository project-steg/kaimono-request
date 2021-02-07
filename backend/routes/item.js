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
      .catch((e) => {
        console.log(e)
        res.status(500).send("Internal Server Error!")
      })
  }
  catch (e) {
    console.log(e)
    res.status(500).send("Internal Server Error!")
  }
})

/*
  POST /item
  買い物リストに一件新規登録する
*/
router.post("/", (req, res) => {
  try {
    const req_data = {
      name: req.body.name,
      amount: Number(req.body.amount),
      place: req.body.place ? req.body.place : null,
      user_id: req.body.user_id ? Number(req.body.user_id) : null,
    }
    models.items.create(req_data)
      .then(() => {
        res.status(204).end()
      })
      .catch((e) => {
        console.log(e)
        res.status(400).send("Bad Request")
      })
  }
  catch (e) {
    console.log(e)
    res.status(500).send("Internal Server Error!")
  }
})

/*
  GET /item/:id
  指定したidのアイテムを一件取得する
*/
router.get("/:id", (req, res) => {
  try {
    const item_id = req.params.id
    models.items.findOne({
      where: {
        id: item_id
      },
      include: [{
        model: models.users, // usersテーブルをJOINする
        required: false // OUTER JOINするため、requiredはfalseにする
      }]
    })
      .then(item => {
        if (!!item) {
          res.json(item)
        }
        else {
          res.status(404).send("Not found")
        }
      })
      .catch((e) => {
        console.log(e)
        res.status(500).send("Internal Server Error!")
      })
  }
  catch (e) {
    console.log(e)
    res.status(500).send("Internal Server Error!")
  }
})

module.exports = router