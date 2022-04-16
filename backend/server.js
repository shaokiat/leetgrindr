import 'dotenv/config'
import express from "express"
import cors from "cors"
import { v4 } from "uuid"
import { createClient } from "redis"
import { createServer } from 'http'
import { Server } from 'socket.io'

const PORT = 5000
const client = createClient({ url: process.env.REDIS_URL })
const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: true,
        methods: ["GET", "POST"]
    }
})

app.use(
    cors({
        credentials: true,
        origin: true
    })
)

// parses incoming JSON requests and puts the parsed data in req.body
app.use(express.json())

client.on('error', console.error)
// Connect to redis
client
    .connect()
    .then(() => console.log('Connected to redis!'))
    .catch(() => {
        console.error('Error connecting to redis')
    })

// For aws healthcheck
app.get("/healthcheck", (req, res) => {
    res.status(200).send("OK")
})

app.post('/create-room', async (req, res) => {
    const {username} = req.body
    const roomId = v4()

    await client.hSet(roomId, {
        roomId: roomId,
        content: "",
        language: "PYTHON"
    }).catch((err) => {
        console.log(1, err)
    })
    await client.expire(roomId, 86400)
    
    res.status(201).send({roomId})
})

io.on('connection', (socket) => {
    console.log("NEW USER")
    console.log(socket)
})



server.listen(PORT, () => console.log(`Server started on port ${PORT}`))