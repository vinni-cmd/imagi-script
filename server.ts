// here we build out our backend api in our server file

// allows us to access then env variables defined in the .env file
import * as dotenv from "dotenv";
dotenv.config();
//
import { Configuration, OpenAIApi } from "openai";
// create openai configuration object which requires api key
const configuration = new Configuration({
  apiKey: process.env.OPENAI,
});

// initialize openai SDK with above configuration
const openai = new OpenAIApi(configuration);

import express from "express";
import cors from "cors";
const app = express();
// apply/config middleware to express(code that will run on every request)
// cors for security
app.use(cors());
// tells api that it only wants to handle incoming data in json format
app.use(express.json());

// create/define endpoint or ?route?
// http method post is used because we are creating a new piece of data
// method takes two arguments
// string that reps the url of the api
// callback func that has a req and res object that we can interact with. callback will be called each time someone navigates to this url
app.post("/imagine", async (req, res) => {
  // in a async function you can handle errors by wrapping code in a try-catch block
  try {
    // access user provided description of image
    const prompt = req.body.prompt;
    // using prompt as a arg for the createImage method, make request to openai api and wait for res before resuming function execution
    // store the response object
    const aiResponse = await openai.createImage({
      prompt,
      // requesting one image only
      n: 1,
      // resolution
      size: "1024x1024",
    });
    // access the image url from the response
    const image = aiResponse.data.data[0].url;
    // send url back to client as response using the send method on the response object
    // client/browser will then receive this data as json
    res.send({ image });
    // res.status(500).json({message:"error"}); still displays hi but also has erorr in console
    // res.download("server.ts") - popup dwnload
    // res.render('index') renders index.html file from views folder - this needs a view engine
  } catch (error: any) {
    // handle errors on the server side
    console.log("SERVER ERROR::: ", error);
    // but also send down an error response back down to the cleint
    // can send diff codes but here just 500 (server failure) to keep it simple
    // chaining on a server message  which might? be defined by openai
    res
      .status(500)
      .send(error?.response.data.error.message || "Something went wrong");
  }
});

// fire up the server by providing the listen method with the port you want to use
// when running this locally it will run on localhost:8080
// optional callback to let you know when server is ready
app.listen(8080, () =>
  // log will show up in terminal because it is server side and not client side
  console.log("make art on http://localhost:8080/imagine")
);

// We now have a complete server which we can run with ts-node server.ts in the terminal
