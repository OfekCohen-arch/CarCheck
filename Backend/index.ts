import 'dotenv/config'
import aiRouter from './src/routes/ai.js'
import cors from 'cors'
import express from 'express'

const app = express()
app.use(cors())
app.use(express.json());

app.use(aiRouter)

const PORT = process.env.PORT || 3030;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));