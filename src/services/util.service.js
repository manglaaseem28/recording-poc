
module.exports.getRecordList = function getRecordList(data){
    if(!data){return [];}
    if(!Array.isArray(data)){return [];}
    return data.map(d => {const item = {'Key':d.Key,
                'LastModified':d.LastModified}
        return item;})
}

module.exports.getFileList = function getFileList(data){
    if(!data){
        return [];
    }
    if(!data.file){
        return [];
    }
    if(!Array.isArray(data.file)){
        return [];
    }
    return data.file.map(d => {const item = 
	{'originalFileName':d.originalFilename,
           'path':d.path,
	'extension':extension(d.originalFilename)}
	console.log(d)
        return item;})
}

function extension(filename){
	return filename.split('.').pop();
}

