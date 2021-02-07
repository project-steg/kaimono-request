const express = require("express")
const cors = require("cors")
const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors())

const healthRouter = require("./routes/health")
const itemRouter = require("./routes/item")
app.use("/health", healthRouter)
app.use("/item", itemRouter)

/* サーバー起動 */
app.listen(5000, () => {
  console.log("server started!")
})