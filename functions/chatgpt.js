const { OpenAI } = require("openai");

exports.handler = async function(event, context) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };
  
  // Handle OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS preflight response' })
    };
  }
  
  try {
    // Parse request body
    const body = JSON.parse(event.body);
    console.log("Request received:", JSON.stringify(body));
    
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    // Make request to OpenAI
    const response = await openai.chat.completions.create({
      model: body.model || "gpt-4", 
      messages: body.messages,
      temperature: body.temperature || 0.7,
      max_tokens: body.max_tokens || 150,
    });
    
    console.log("OpenAI response received");
    
    // Return the response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };
  } catch (error) {
    console.error("Function error:", error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message,
        details: error.toString()
      })
    };
  }
};
