import 'dotenv/config'
import aiRouter from './src/routes/ai.js'
import carRouter from './src/routes/cars.js'
import plateRouter from './src/routes/plate.js'
import cors from 'cors'
import express from 'express'

const app = express()
app.use(cors())
app.use(express.json());

app.use(aiRouter)
app.use(carRouter)
app.use(plateRouter)

const PORT = process.env.PORT || 3030;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));