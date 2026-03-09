import express from 'express';
import routes from './routes/auth.routes'
import cookieParser from "cookie-parser";

const app = express()
const port = 4000
app.use(express.json());
app.use(cookieParser());

app.use('/api', routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

