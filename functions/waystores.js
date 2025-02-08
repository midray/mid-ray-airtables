require('dotenv').config()
// const Airtable = require('airtable-node');
const Airtable = require('airtable');
 
// const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
//   .base('apptlryffDLzdfLWt') 
//   .table('Products')

const airtable = Airtable.configure({ 
  endpointUrl: 'https://api.airtable.com',
  apiKey: process.env.AIRTABLE_API_KEY
})
// .base('apptlryffDLzdfLWt') 
// .table('Products')

  // const table = require('airtable').base('apptlryffDLzdfLWt')
  // console.log(table)
  
  // Airtable.configure({
  //     endpointUrl: 'https://api.airtable.com',
  //     apiKey: 'YOUR_SECRET_API_TOKEN'
  // });
  const base = Airtable.base('apptlryffDLzdfLWt');

 exports.handler = async (event, context, cb) =>{
  // console.log(event)

const {id} = event.queryStringParameters
console.log(id)
if(id){
  try{
    // let product = await airtable.retrieve(id);
    // if(product.error){
    //   return {
    //     statusCode: 404,
    //     body: `No Product with an ID: ${id}` 
    //   }
    // }

   
      const record = await base('Products').find(id);
      console.log(record.fields); // Logs the retrieved record's fields
      // return record.fields;
      return {
        // headers:{
        //   'Access-Control-Allow-Origin': '*'
        // },
        statusCode: 200,
        body: JSON.stringify(record.fields)
      }
  // } catch (error) {
  //     console.error('Error fetching record:', error);
  // }
  
   
  }catch(error){
    return {
      statusCode: 500,
      body: `Server Error` 
    }
  }
  
}else{
 
    try {
      const records = await base('Products').select({
          maxRecords: 100,  // Set limit, remove for all records
          view: "Grid view" // Ensure correct view (optional)
      }).all(); // <-- This is required to resolve the promise

      
      const newRecords = records.map((product)=>{
                const {id} = product;
                const {category, brand, images, review, title, offer_price, price, banner, campaingn_product, cam_product_available, cam_product_sale, product_type} = product.fields
                const url = images[0].url
                return {category, brand, url, review, title, offer_price, price, banner, campaingn_product, cam_product_available, cam_product_sale, product_type, id}
              })

      return {
        statusCode: 200,
        body: JSON.stringify(newRecords)
      }
  // .eachPage(function page(records, fetchNextPage) {
  //     // This function (`page`) will get called for each page of records.
  
  //     // records.forEach(function(record) {
  //     //     console.log(record);
  //     // });
  //     const newRecords = records.map((product)=>{
  //         const {id} = product;
  //         const {category, brand, images, review, title, offer_price, price, banner, campaingn_product, cam_product_available, cam_product_sale, product_type} = product.fields
  //         const url = images[0].url
  //         return {category, brand, url, review, title, offer_price, price, banner, campaingn_product, cam_product_available, cam_product_sale, product_type, id}
  //       })

  //       fetchNextPage();

  //       return {
  //         headers:{
  //           'Access-Control-Allow-Origin': '*'
  //         },
  //         statusCode: 200,
  //         body: JSON.stringify(newRecords)
  //       }
  
      // To fetch the next page of records, call `fetchNextPage`.
      // If there are more records, `page` will get called again.
      // If there are no more records, `done` will get called.
      
  
  // }, function done(err) {
  //     if (err) { console.error(err); return; }
  // });
   
    // const products = records.map((product)=>{
    //   const {id} = product;
    //   const {category, brand, images, review, title, offer_price, price, banner, campaingn_product, cam_product_available, cam_product_sale, product_type} = product.fields
    //   const url = images[0].url
    //   return {category, brand, url, review, title, offer_price, price, banner, campaingn_product, cam_product_available, cam_product_sale, product_type, id}
    // })
  }catch(error){
    console.log(error)
    return {
      statusCode: 500,
      body: 'Server Error'
    }
  }
}


  
 
}