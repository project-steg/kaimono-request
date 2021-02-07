const express = require("express")
const cors = require("cors")
const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(cors())

/* サーバー起動 */
app.listen(5000, () => {
  console.log("server started!")
})