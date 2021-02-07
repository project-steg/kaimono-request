# Stegチュートリアル: 家族用買ってきてほしいものリストシステム(Node.js+Express) - バックエンドの設計から開発まで

## 設計

### エンドポイント
- GET /item
リストに入っているアイテムを全件取得する
- POST /item
リストに1件新規追加する
- PUT /item/${id}
指定したidのアイテムを編集する
- DELETE /item/${id}
指定したidのアイテムを削除する
- GET /health
生存確認（テスト用）。OKを返す

### テーブル
- itemsテーブル
    - `id`: アイテムのid
        SERIAL型, NOT NULL, PRIMARY KEY
    - `name`: アイテムの名前
        TEXT型, NOT NULL
    - `place`: アイテムを購入する場所(任意)
        TEXT型
    - `amount`: アイテムの購入数
        INT型, NOT NULL
    - `user_id`: 買ってくる人のユーザid(任意)
        INT型, FOREIGN KEY→usersテーブルのid
    - `created_at`: アイテムを追加した日付
        DATETIME型, NOT NULL
    - `updated_at`: アイテムを更新した日付
        DATETIME型, NOT NULL
- usersテーブル
    - `id`: ユーザのid
        SERIAL型(オートインクリメントする) NOT NULL, PRIMARY KEY
    - `name`: ユーザの名前
        TEXT型, NOT NULL

#### 注釈
- SERIAL型とは  
MySQLで言うところの「オートインクリメント」のこと。idが自動的に1個ずつ増やされていく。
- NOT NULLとは  
NULLを許容しない。必ずその型の何らかの値が入ることになる。
- PRIMARY KEYとは  
そのテーブルの中で一意(重複した値が入らない)のものとなり、この値を基準に検索・結合される。この値は必ずNOT NULLである。
- FOREIGN KEYとは  
依存関係にある2つのテーブルを結びつけるために設定する。この例でいうと、itemsテーブルのuser_idは、usersテーブルのidから選ばれる。

### 構成
- フロントエンド: Nuxt.js
- バックエンド: Node.js(Express)
- DB: PostgreSQL

## バックエンドサーバー開発の下準備
### プロジェクトの作成
- 新しくディレクトリをつくる
- `npm init` でプロジェクト初期化
- `npm install express` でexpressをインストール
- `npm install sequelize sequelize-cli` でSequelizeというORMマッパーをインストール
- `npm install -g sequelize-cli` でSequelize-CLIをグローバルにインストール
- `npx sequelize-cli init` でSequelizeの初期化
- `npm install pg pg-hstore` でPostgreSQLに接続するためのモジュールをインストール
- ルートディレクトリに `index.js` を作成

この時点でのディレクトリ構造は以下のとおり

![](https://i.imgur.com/UWR5D1p.png)

### Docker-composeでDBをサクッと建てる
- ルートディレクトリに `docker-compose.yml` を作成
- 中に以下をコピペする
```yaml=
version: '3'
services:
  db:
    image: postgres:latest # PostgreSQLの最新版イメージを使用
    container_name: kaimono-db # コンテナ名を明示的に指定
    ports:
      - 5433:5432 # 本来は5432ポートを使うが、衝突を避けるため5433を使用。クライアント側の5433番ポートを、コンテナ側の5432ポートにつなげる
    volumes:
      - ./postgres/init:/docker-entrypoint-initdb.d # 初期化時に実行するSQLファイルの置き場を指定
    environment: # DBのユーザ名・パスワードを指定(変えても良い)
      POSTGRES_USER: steg
      POSTGRES_PASSWORD: U2p7wsaC
      POSTGRES_DATABASE: kaimono
      POSTGRES_INITDB_ARGS: "--encoding=UTF-8"
    hostname: postgres
    restart: always
    user: root
```
- `postgres` ディレクトリを作成し、その中に `init` ディレクトリを作成する
- initディレクトリの中に `01_init_database.sql` というファイルを作成し、以下をコピペ
```sql
CREATE DATABASE "kaimono" encoding "UTF8";
```
- 起動できるか確かめる `docker-compose -p kaimono-request up -d`
![](https://i.imgur.com/MwMxMAn.png)

### Sequelizeの設定
- `/config/config.json` を開く
- 全部消して、以下に置き換える。これはdocker-compose.ymlに書いた設定と同じにする
```json=
{
  "development": {
    "username": "steg",
    "password": "U2p7wsaC",
    "database": "kaimono",
    "port": 5433,
    "host": "127.0.0.1",
    "dialect": "postgresql"
  }
}
```

ここまでで下準備完了

## 実際に書いていく
### index.jsの作成
- corsに対応するため `npm install cors` する
- index.jsに書く
```javascript=1
const express = require("express")
const cors = require("cors")
const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json()) // jsonを自動的にparseする
app.use(cors()) // cors対応

/* サーバー起動 */
app.listen(5000, () => {
  console.log("server started!")
})
```
- 起動確認するため `node index.js` を実行する
`server started!` と表示されればOK

### GET /health を作成
- GETでアクセスされたら `OK` と返す処理
- `routes` ディレクトリを作成する
- その中に `health.js` を作成し、以下をコピペ
```javascript=1
const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
  res.send("OK")
})

module.exports = router
```
- index.jsに追記する
```javascript=8
const healthRouter = require("./routes/health")
app.use("/health", healthRouter)
```
- `node index.js` でサーバーを実行し、 http://localhost:5000/health にアクセス
![](https://i.imgur.com/5QOqErC.png)

### DBのスキーマ・モデル定義
#### itemsテーブル
- まずは `items` モデルを定義する。 
```bash
npx sequelize-cli model:create --name items --underscored --attributes name:string,place:string,amount:integer,user_id:integer
```
を実行する
- このコマンドにより、 `migrations/(時間)-create-items.js` と、 `models/items.js` の2つのファイルが作成される。前者は初期化時にテーブルを自動で作成(migration)してくれるファイルで、後者はそのテーブルからデータを呼び出すために使うもの。
- つぎに、 `migrations` の方のファイルを開き、不足している `allowNull` を追記していく。今回は `name` と `amount` がNOT NULLである必要があるので、ここに `allowNull: false` を追記する
```javascript=4
    await queryInterface.createTable('items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false, // ここを追記
        type: Sequelize.STRING
      },
      place: {
        type: Sequelize.STRING
      },
      amount: {
        allowNull: false, // ここを追記
        type: Sequelize.INTEGER
      },
```

#### usersテーブル
- 同じようにコマンドを実行する
```
npx sequelize-cli model:create --name users --underscored --attributes name:string
```
- 今回はそのままで良いので、このまますすめる

#### 外部結合(OUTER JOIN)を設定する
- 今回の場合は、itemsテーブルに含まれている「user_id」を使って、usersテーブルに含まれているnameも一緒に取得したいので、結合する必要がある
- ただし、user_idはNULLが許容されるため、内部結合ではなく外部結合を用いる。
- `items.js`の static associate 内に以下を追記する
```javascript=12
    static associate(models) {
      items.belongsTo(models.users, { // ここから追記
        foreignKey: "user_id", // 外部キーはitemsテーブル側のuser_id
        targetKey: "id" // 結合先はusersテーブル側のid
      })
    }
```

#### ちゃんとDBに反映できるかテストする
- `docker-compose -p kaimono-request up -d` でDBを立ち上げる
- `npx sequelize-cli db:migrate` でmigration できる

ここまで出来たらDB周りは完成

### GET /item を作成
- GET /items は「買い物リストに入っている物を新しい順に全件取得する」という機能をもたせる
- `routes/item.js` を新規作成する
```javascript=1
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

module.exports = router
```

- やってることは単純で、11行目で `findAll()` メソッドを使って全件取得している。
- 12行目のorderプロパティで並び替えを実施
- 15行目のincludeプロパティでusersテーブルと外部結合
- .then でつなげて、21行目で取得してきた結果をまるごとjson形式で送信している
- もしエラーが起こったら24行目のcatchに流れて、26行目でステータスコード500としてInternal Server Errorだと伝えている

ここまでできたら、index.js側にも反映させる

```javascript=8
const healthRouter = require("./routes/health")
const itemRouter = require("./routes/item") // ここを追記
app.use("/health", healthRouter)
app.use("/item", itemRouter) // ここを追記
```

### POST /item を作成
- POST /item は、リクエストボディの中のパラメータをもとに、買い物リストに一件新規追加する機能をもたせる
- `router/item.js` を編集する
```javascript=30
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

module.exports = router
```

- リクエストボディに含めた値は、 `req.body.プロパティ名` で取得することが出来る。
- 36行目に一度 `req_data` という名前のオブジェクトに格納し、これを 41行目の create() メソッドでDBに登録する。
- 渡されなかった値(=falseになった場合)は三項演算子を使い、nullを入れている。
- 一応Number()を使って数値型に変換している。
- 成功したら(then)204を返す。204はNo Contentsという意味で、リクエストが正常に終了したことを示す。
- 失敗したらcatchに入り、400 Bad Requestを返す。それ以外のエラーは500 Internal Server Errorを返す。

### GET /item/:id を作る
- GET /item/:idは、指定したidと一致するアイテムを一件取得する機能をもたせる。
- item.js に以下を追記する。

```javascript=61
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
        res.send(500).send("Internal Server Error!")
      })
  }
  catch (e) {
    console.log(e)
    res.send(500).send("Internal Server Error!")
  }
})
```

- /item/:id の `:id` 部分は、 `req.params.id` で取得することが出来る。
- 一件だけ取得するときは、 `findOne()` メソッドを利用する。ここで `where` を指定することで、条件を指定することが出来る。

### PUT /item/:id を作成する
- PUT /item/:idは、指定したidと一致するアイテムを更新する機能をもたせる。
- item.js に以下を追記する。

```javascript=96
/*
  PUT /item/:id
  指定したidのアイテムを編集する
*/
router.put("/:id", (req, res) => {
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
          item.name = req.body.name
          item.amount = Number(req.body.amount)
          item.place = req.body.place ? req.body.place : null
          item.user_id = req.body.user_id ? Number(req.body.user_id) : null
          item.save()
          res.status(204).end()
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
```

- Sequelizeでは、一件更新する場合は「一度一件取得」したあとに、これを上書きする形で値を格納することになる。保存するときは `item.save()` をする。

### DELETE /item/:id を作成する
- PUT /item/:idは、指定したidと一致するアイテムを削除する機能をもたせる。
- item.js に以下を追記する。

```javascript=136
/*
  DELETE /item/:id
  指定したidのアイテムを削除する
*/
router.delete("/:id", (req, res) => {
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
          item.destroy() // 取得したアイテムを削除
          res.status(204).end()
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
```

- Sequelizeでは、一件更新する場合は「一度一件取得」したあとに、これを削除する形で値を格納することになる。保存するときは `item.destroy()` をする。

### ユーザの初期データを入れる
- ユーザのCRUD(Create, Read, Update, Delete)を作っても良いが、ユーザはめったに更新されないため、登録する手間を削減するためにも、初期データとして初期化時に挿入することとする。
- その場合、Sequelizeの「Seed」機能を利用する。
- 以下のコマンドを入力する。
```
npx sequelize-cli seed:generate --name init-users
```
- すると、`seeders/(時間)-init-users.js` というファイルが出来るので、開いて以下を入力する。

```javascript=1
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [
      { name: "父", created_at: new Date(), updated_at: new Date() },
      { name: "母", created_at: new Date(), updated_at: new Date() },
      { name: "兄", created_at: new Date(), updated_at: new Date() },
      { name: "弟", created_at: new Date(), updated_at: new Date() },
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {})
  }
};

```

- 以下のコマンドを実行すると、初期値をDBの中に挿入することができる。

```
npx sequelize-cli db:seed:all
```

![](https://i.imgur.com/DfEgqNm.png)

idは1から始まるので注意。

### 動作確認

REST API CLIENTなどを使って動作確認する。

##### POSTが正常に終了する

![](https://i.imgur.com/94BA2sn.png)

##### GETが正常に終了する

![](https://i.imgur.com/MNrKVNI.png)

##### POSTが失敗する(nameがない場合)

![](https://i.imgur.com/sH3CKPN.png)

この後、PUTとDELETEも同様に行い、全件取得して正常に反映されているかチェックする。

## Dockerで自動起動できるようにする

- このままだと、DBは自動起動できるが、スクリプト側は手動で起動しなければならない
- これをDockerで両方とも同時に起動できるようにしたい

### Dockerfileを書く
- Dockerfileという名前のファイルを作り、以下をコピペする
```dockerfile=1
FROM node:latest

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --no-optional && npm cache clean --force

RUN npm install pm2 -g

COPY . .

EXPOSE 5000

ENTRYPOINT ./entrypoint.sh
```

### 起動時スクリプト entrypoint.sh を作成
- entrypoint.sh という名前のファイルを作り、以下をコピペする
```bash=1
echo "30秒待機します"

sleep 30s

./node_modules/sequelize-cli/lib/sequelize db:migrate

./node_modules/sequelize-cli/lib/sequelize db:seed:all

pm2-runtime ./index.js
```

- ここでは、Node.jsのプロセスマネージャである PM2 を用いて、もしプロセスが強制終了してしまったときに自動で再起動してくれるように構成している。
- 30秒待機させているのは、DBの起動が間に合わないため（本当はちゃんと起動確認してから動作させるべきだが、面倒なのでここでは30秒と固定させてしまっている）

### docker-compose.yml を修正する
```yaml=1
version: '3'
services:
  db:
    image: postgres:latest
    container_name: kaimono-db
    ports:
      - 5433:5432
    volumes:
      - ./postgres/init:/docker-entrypoint-initdb.d
    environment:
      POSTGRES_USER: steg
      POSTGRES_PASSWORD: U2p7wsaC
      POSTGRES_DATABASE: kaimono
      POSTGRES_INITDB_ARGS: "--encoding=UTF-8"
    hostname: kaimono-db
    restart: always
    user: root
    networks:
      - kaimono-network

  app:
    image: kaimono-backend
    build: ./
    ports: 
      - "5000:5000"
    networks:
      - kaimono-network
    depends_on:
      - "db"

networks:
  kaimono-network:
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.0.0/24
```

- appとnetworkを追記。これでnodeのアプリケーションからDBを触ることができるようになる

### config.jsonも修正する
```json=1
{
  "development": {
    "username": "steg",
    "password": "U2p7wsaC",
    "database": "kaimono",
    "port": 5433,
    "host": "127.0.0.1",
    "dialect": "postgresql"
  },
  "production": {
    "username": "steg",
    "password": "U2p7wsaC",
    "database": "kaimono",
    "port": 5433,
    "host": "172.20.0.1",
    "dialect": "postgresql"
  }
}
```

- NODE_ENV=productionを指定したときに接続するDBを変更する
- hostが `172.20.0.1` を向くようにする

### 起動確認してみる

- まずは現在立ち上がっているコンテナを終了させる
```bash
docker-compose -p kaimono-request down
```
- buildをする
```bash
docker-compose build
```
- buildが正常に終了したら、upする
```bash
docker-compose -p kaimono-request up -d
```
- 1分程度待つ
- docker ps -a してちゃんと表示されてたらOK
![](https://i.imgur.com/Evolivw.png)
- http://localhost:5000/health でOKが返ってくるか確認

## おしまい
これでバックエンドの開発はおしまい

出来上がったコードはこちらになります: https://github.com/project-steg/kaimono-request/tree/master/backend