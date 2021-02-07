# Stegチュートリアル: 家族用買ってきてほしいものリストシステム(Node.js+Express) バックエンド

詳細はこちら: https://hackmd.io/@920oj/BJwNU7Teu

## API仕様
### GET /item
買うものリストに入っているアイテムを全件取得します。

### GET /item/:id
指定したidのアイテムを一件取得します。

### POST /item
買うものリストに1件新規登録します。

リクエストパラメータ  
- name: 買うものの名前(必須)
- place: 買う場所(任意)
- amount: 買う量(必須, 数値で指定)
- user_id: 買う人のユーザID(任意, 数値で指定)

### PUT /item/:id
指定したidのアイテムを一件更新します。

リクエストパラメータ  
- name: 買うものの名前(必須)
- place: 買う場所(任意)
- amount: 買う量(必須, 数値で指定)
- user_id: 買う人のユーザID(任意, 数値で指定)

### DELETE /item/:id
指定したidのアイテムを一件削除します。