echo "30秒待機します"

sleep 30s

./node_modules/sequelize-cli/lib/sequelize db:migrate

./node_modules/sequelize-cli/lib/sequelize db:seed:all

pm2-runtime ./index.js