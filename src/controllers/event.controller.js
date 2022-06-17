
const utilService = require('../services/util.service')
const s3Service = require('../services/s3.service')
const multiparty = require('multiparty');

const getSignedUrl = async (req, res) => {
    try {
        console.log(req.query)
        if (!req.query.fileName) {
            return res.status(404).json({ message: 'fileName not defined' })
        }
        var params = { Bucket: storageBucket, Key: req.query.fileName, Expires: 600 };
        console.log(params)
        const url = await s3.getSignedUrl('getObject', params)
        res.status(200).json({ message: 'Success', data: url })

    }
    catch (e) {
        console.log(e)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const getRecording = (req, res) => {
    s3Service.lists3Objects()
        .then(list => {
            res.status(200).json({ message: "Success", data: utilService.getRecordList(list) });
        })
        .catch(e => {
            console.log(e);
            res.status(500).json({ message: 'Internal Server Error' })
        })
}

const handleEvent = (req, res) => {
    var form = new multiparty.Form();
    form.parse(req, async function (err, fields, files) {
        try {
            const fileList = utilService.getFileList(files);
            if (fileList.length) {
                console.log(fileList)
                if (fileList[0].extension == 'mp4') {
                    await s3Service.uploadNewFile(base_folder_name + '/' + fileList[0].originalFileName, fileList[0].path)
                }
                fs.unlink(fileList[0].path, () => { });
                res.send('ok')
            } else {
                res.send('ok')
            }
        }
        catch (e) {
            console.log(e)
            res.send('ok')
        }
    });
}
module.exports = {
    getSignedUrl,
    getRecording,
    handleEvent
}