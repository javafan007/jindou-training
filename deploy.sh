

cd src/client && npm install && npm start
cd ../server && npm install

pm2 restart pm2.json --env $1