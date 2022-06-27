const appConfig = {
    SERVER_PORT: process.env.PORT || 3000,
    // BASE_URL: process.env.BASE_URL || 'http://localhost:5000',
    AWS: {
        region: process?.env?.AWS_DEFAULT_REGION
    }

};
if (process?.env?.AWS_ACCESS_KEY_ID) { appConfig.AWS.accessKeyId = process?.env?.AWS_ACCESS_KEY_ID; }
if (process?.env?.AWS_SECRET_ACCESS_KEY) { appConfig.AWS.secretAccessKey = process?.env?.AWS_SECRET_ACCESS_KEY; }

module.exports = appConfig;