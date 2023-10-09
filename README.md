# nodeTemplate
Template for Node Projects

To setup
1. Change `package.json` contents
1. edit the vars file in the terraform folder
1. edit the routes in the api gw
2. add the routes needed

To run locally `docker-compose down && docker-compose build --no-cache && docker-compose up`

To add Lambda Layer
1. change package.json file
2. run `npm install`
3. compress into a zip that has `node_modules` as the contents
