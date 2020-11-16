const http = require('http');
const formidable = require('formidable');
var multer  =   require('multer');
const fs = require('fs');
const path = require('path');
//const app = express();

/*

let storage = multer.diskStorage({
    destination :  path.join(__dirname,'src','uploads'),
    filename : (req, file, callBack) =>{
        callBack(null,`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);

    }
      
})
const uploads = multer({
    storage : storage
})
app.post('/uploads',(req , res)=>{
    uploads(req,res,err=>{
        if(err){
            res.status(404);
        }else{
            res.status(201).json({ message: 'bien telecharger' });
        }
    })
})
module.exports = {storage};*/

// lister tous les Fichiers d'un repertoire 
/*
exports.listfile = function(dir, filelist) {
    files = fs.readdirSync(dir);
    filelist = [];
    files.forEach(function(file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist = listfile(path.join(dir, file), filelist);
        }
        else {
            filelist.push(path.join(dir, file));
        }
    });
    return filelist;
};*/