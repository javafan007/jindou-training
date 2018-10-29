

cd src/client && npm install && npm start
cd ../server && npm install && cd ../..

pm2 restart pm2.json --env $1