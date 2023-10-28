require("dotenv").config()
const express =require('express')
const mongoose=require('mongoose');
const routes=require("./Routes/routes");
const cors=require("cors")



const PORT=8000;

const app=express();

app.use(express.json());

app.use(cors())

app.use('/api',routes)




// connect to mongodb




app.listen(PORT,()=>console.log(`server started localHost:${PORT}`))