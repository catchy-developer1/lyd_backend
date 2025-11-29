const express=require('express');
const app=express();
require('dotenv').config()
const user=require('./routes/user')
const services=require('./routes/user_service')
const jobs=require('./routes/job_webinar')
const logger=require('./utills/error_logger/error_log')
logger



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectDB=require('./db_config')
connectDB();

app.use('/lyd/user',user);
app.use('/lyd/services',services)
app.use('/lyd/jobs',jobs)
app.use('/ProfilePictures',express.static('ProfilePictures'))
app.use('/certificates',express.static('certificates'))

const port=process.env.PORT||3000;

app.listen(port,(error)=>{
    if(error){
     console.log(`server not connected ${port} ${error}`)
    }
    else{
       console.log(`server connected on port ${port} suceessfully`)
    }
})