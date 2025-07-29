import express from 'express'


const app = express()

app.use(express.json())




// App routes
app.get('/', (req, res)=>{
    res.json({message: 'API is up and running! 🚀'})
})


// 404 handler



// centralized error handler








export default app