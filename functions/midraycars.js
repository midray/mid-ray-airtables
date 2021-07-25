// require('dovenv').config()
const Airtable = require('airtable-node');
 
const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base('appQOJJv48Y1LxBbM')
  .table('Products')


 exports.handler = async (event, context, cb) =>{

const {id} = event.queryStringParameters
if(id){
  try{
    const product = await airtable.retrieve(id);
    if(product.error){
      return {
        statusCode: 404,
        body: `No Product with an ID: ${id}` 
      }
    }
    return {
      headers:{
        'Access-Control-Allow-Origin': '*'
      },
      statusCode: 200,
      body: JSON.stringify(product)
    }
  }catch(error){
    return {
      statusCode: 500,
      body: `Server Error` 
    }
  }
  
}else{
  try{
    const {records} = await airtable.list();
    const products = records.map((product)=>{
      const {id} = product;
      const {name, color, price, fuel_type, brand, year, mileage, type, images, transmission} = product.fields
      const url = images[0].url
      return {name, color, price, fuel_type, brand, year, mileage, type, transmission, url, id}
    })
    return {
      headers:{
        'Access-Control-Allow-Origin': '*'
      },
      statusCode: 200,
      body: JSON.stringify(products)
    }
  }catch(error){
    return {
      statusCode: 500,
      body: 'Server Error'
    }
  }
}


  
 
}