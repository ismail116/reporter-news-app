const express = require('express')
const reporterRouter = require('./routers/reporter')
const newsRouter = require('./routers/news')
const app = express()
const port = process.env.PORT || 3000

// connect database
require('./db/mongoose')

// parse automatic
app.use(express.json())
app.use(reporterRouter)
app.use(newsRouter)



app.listen(port,()=>{console.log('Server is running')})

/////////////////////////////////////////////////////////////////

