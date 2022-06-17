const AWS_S3 = require("aws-sdk");
const fs = require("fs");
const appConfig = require('../config')

AWS_S3.config.update(appConfig?.AWS);
const s3 = new AWS_S3.S3();

const storageBucket = process.env.AWS_S3_BUCKET
const base_folder_name = 'testVideo';

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

module.exports = {
    uploadNewFile,
    lists3Objects
}