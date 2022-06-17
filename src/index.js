
const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const AWS_S3 = require("aws-sdk");
const fs = require("fs");
const storageBucket = process.env.AWS_S3_BUCKET
const base_folder_name = 'testVideo';
const appConfig = {
    AWS: {
        region: process.env.AWS_DEFAULT_REGION
    },
};
appConfig.AWS.accessKeyId = process.env.AWS_ACCESS_KEY_ID
appConfig.AWS.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
AWS_S3.config.update(appConfig.AWS);
const s3 = new AWS_S3.S3();
// defining the Express app
const {getRecordList,getFileList} = require('./util');
const {keytoken} = require('./auth')
const app = express();
// defining an array to work as the database (temporary solution)
// adding Helmet to enhance your Rest API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));


// defining an endpoint to return all ads
app.get('/signedUrl',keytoken,async (req,res)=>{
try{
	console.log(req.query)
	if(!req.query.fileName){
		return res.status(404).json({message:'fileName not defined'})
	}
	var params = {Bucket: storageBucket , Key: req.query.fileName, Expires:600};
	console.log(params)
   const url = await s3.getSignedUrl('getObject', params)
	     res.status(200).json({message:'Success',data:url})
	
}
catch(e){
	console.log(e)
 res.status(500).json({message:'Internal Server Error'})
}
})
app.get('/recordings',keytoken ,(req, res) => {
	lists3Objects()
	.then(list => {
       		res.status(200).json({message:"Success",data:getRecordList(list)});
	})
	.catch(e => {
	console.log(e);
		res.status(500).json({message:'Internal Server Error'})
	})
});
var multiparty = require('multiparty');
var util = require('util');
const uploadNewFile = (fileName, location) =>{
    return new Promise(async function (resolve, reject) {
      fs.readFile(location, (err, fileContent) => {
        if (err) {
          reject(err);
          return;
        }
        const params = {
          Bucket: storageBucket,
          Key: fileName,
          Body: fileContent,
        };
        s3.upload(params, function (s3Err, data) {
          let result = {};
          if (s3Err) {
            console.error(`uploadNewFile Err: ${s3Err}`);
            reject(s3Err);
          } else {
            result.success = true;
            console.log(`uploadNewFile response: ${JSON.stringify(data)}`);
            resolve(result);
          }
        });
      });
    });
}
const lists3Objects = async (storageBucket) => {
    return new Promise((resolve, reject) => {
        try {
            const params = {
                Bucket: process.env.AWS_S3_BUCKET,
                Prefix: base_folder_name
            }
		console.log(params)
            let s3ObjectListPromise = s3.listObjects(params).promise();
            s3ObjectListPromise.then((data) => {
                // console.log(data);
                resolve(data.Contents)
            })
            s3ObjectListPromise.catch((err) => {
                console.log(err);
                reject(err)
            })
        } catch (error) {
            console.log(error);
            reject(error)
        }
    })
}
app.post('/events',(req,res) => {
    var form = new multiparty.Form();
    form.parse(req, async function(err, fields, files) {
		try{
		const fileList = getFileList(files);
		if(fileList.length){
		 console.log(fileList)
                 if(fileList[0].extension == 'mp4'){
			await uploadNewFile(base_folder_name+'/'+fileList[0].originalFileName,fileList[0].path)
		 }
		fs.unlink(fileList[0].path, () => {}); 
		res.send('ok')
		}else{
			res.send('ok')
		}
		}
		catch(e){
			console.log(e)
			res.send('ok')
		}
	});
});
const port = process.env.PORT || 3000;
// starting the server
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

