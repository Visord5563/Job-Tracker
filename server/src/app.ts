import express from 'express';
import authroutes from './routes/auth.routes'
import approutes from './routes/applications.routes'
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express()
const port = 4000

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api', authroutes);
app.use('/api', approutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

