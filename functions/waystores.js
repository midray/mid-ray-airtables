// require('dovenv').config()
const Airtable = require('airtable-node');
 
const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base('apptlryffDLzdfLWt') 
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
  //   airtable('Products').select({
  //     view: 'Grid view'
  // }).firstPage(function(err, records) {
  //     if (err) { console.error(err); return; }
  //     records.forEach(function(record) {
  //         console.log('Retrieved', record.get('item_id'));
  //     });
  // });
    const {records} = await airtable.list({ maxRecords: 100});
   
    const products = records.map((product)=>{
      const {id} = product;
      const {category, brand, images, review, title, offer_price, price, banner, campaingn_product, cam_product_available, cam_product_sale, product_type} = product.fields
      const url = images[0].url
      return {category, brand, url, review, title, offer_price, price, banner, campaingn_product, cam_product_available, cam_product_sale, product_type, id}
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