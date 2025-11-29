const mongoose=require('mongoose');
require('dotenv').config()

const connectDB=async()=>{
    try{
            const dbName = process.env.APP_NAME || 'Locate_your_dentist';

     const conn = await mongoose.connect(`mongodb://localhost:27017/${process.env.APP_NAME}`, {
      useNewUrlParser: true,
      //useUnifiedTopology: true,
    });
     console.log('database connection created successfully');

    }
    catch(error){
     console.log(`database not connected ${error}`)
    }
}


module.exports=connectDB;