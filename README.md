<!-- this project stup like -->
first I run cmd npm init aftere that npm install express sequelize pg pg-hstore dotenv npm install --save-dev nodemon sequelize-cli
after that craete a file .sequelizerc

for tsconfig.json file create npx tsc --init
then add  this things in that file
  "outDir": "./dist",
    "rootDir": "./src"
     "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]


then craete manually src folder
after that creating migrations,config,models,seeders we should run thi s command
npx sequelize-cli init
then in src we can create app.ts file 
and create .env file



