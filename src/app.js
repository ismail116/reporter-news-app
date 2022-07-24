const express = require('express')
const reporterRouter = require('./routers/reporter')
const newsRouter = require('./routers/news')
const app = express()
require('dotenv').config()
const port = process.env.PORT 

// connect database
require('./db/mongoose')

// parse automatic
app.use(express.json())
app.use(reporterRouter)
app.use(newsRouter)



app.listen(port,()=>{console.log('Server is running '+ port)})

/////////////////////////////////////////////////////////////////

