const express = require("express")
const cors = require("cors")
const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(cors())

const healthRouter = require("./routes/health")
app.use("/health", healthRouter)

/* サーバー起動 */
app.listen(5000, () => {
  console.log("server started!")
})