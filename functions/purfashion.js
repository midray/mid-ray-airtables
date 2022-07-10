// require('dovenv').config()
const Airtable = require('airtable-node');
 
const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base('appyel8qUCJFnotw1') 
  .table('Products')


 exports.handler = async (event, context, cb) =>{

const {id} = event.queryStringParameters
if(id){
  try{
    let product = await airtable.retrieve(id);
    if(product.error){
      return {
        statusCode: 404,
        body: `No Product with an ID: ${id}` 
      }
    }
    const {id} = product;
    const {category, name, price, images, size, material, dimension, innerMaterial, weight, stock, instock} = product.fields
    return {
      headers:{
        'Access-Control-Allow-Origin': '*'
      },
      statusCode: 200,
      body: JSON.stringify({id, category, name, price, images, size, material, dimension, innerMaterial, weight, stock, instock})
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
      const {category, name, price, images, size, material, dimension, innerMaterial, weight, stock, instock} = product.fields
      const url = images[0].url
      console.log(products);
      return {category, name, price, size, material, dimension, innerMaterial, weight, stock, instock, url, id}
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