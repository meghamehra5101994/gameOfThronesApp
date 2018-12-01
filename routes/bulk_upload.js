var express = require('express');
var request = require('request');
const hawk = require('hawk');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var router = express.Router();
var session = require('express-session');

var multer = require('multer');
var bodyParser = require('body-parser')

var path = require("path");
var fs = require("fs");
var http = require("http");


var Converter = require("csvtojson").Converter;


// router.get('/bulk_upload', function(req, res, next) {
//     var sess = req.session;
//     // if (isSessionValid(req)) {
//     res.render('admin/bulk_upload');
//     // }

// });


var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function(req, file, cb) {
        var time_stamp = moment().format("MM-DD-YYYY_HH.mm");
        global.fileTitle = "Data" + "_" + time_stamp + path.extname(file.originalname);
        cb(null, global.fileTitle);
    }
});
var upload = multer({ storage: storage });

router.post('/bulk_upload', upload.any(), async(function(req, res, next) {
    var length = Object.keys(req.files).length;
    console.log("error comes here");
    console.log(length);
    var url = BaseURL + "uploads/" + global.fileTitle;

    //  console.log(toJSONString(req.body) + " and file name : " + global.fileTitle);
    console.log("Url : " + url);

    var errors = new Array();
    var areas = new Array();
    var filePath = url;
    var fileName = global.fileTitle;

    if (filePath == undefined || filePath.trim() === "") {
        InfoLogger("file path is undefined");
        res.status(400).json({ success: false, msg:'INVALID_INPUT_PARAMETERS'});
    } else if (fileName == undefined || fileName.trim() === "") {
        InfoLogger("file name is undefined");
        res.status(400).json({ success: false, msg:'INVALID_INPUT_PARAMETERS'});
    } else {

        var uploadPath = path.join(APP_BASE_PATH, path.join('public', 'uploads'));
        uploadPath = path.join(uploadPath, 'game');
        uploadPath = path.join(uploadPath, 'bulk');
        try {
            var uploadedFilePath = path.join(uploadPath, fileName);
            console.log(uploadedFilePath);
            var fileWriteStream = fs.createWriteStream(uploadedFilePath);
            var error_code = 0;
            // creating a sequence of transaction queries: 
            var request = await (
                http.get(filePath, function(response) {
                    console.log("Inside Request ");
                    response.pipe(fileWriteStream);
                    fileWriteStream.on('error', function(err) {
                        console.log("Error : " + err);
                       
                    });
                    fileWriteStream.on('pipe', function() {
                        console.log("Upload Begin");
                    });
                    fileWriteStream.on('close', function() {
                        console.log("Upload Finished");
                        var fileStream = fs.createReadStream(uploadedFilePath);
                        console.log("Upload done");
                        var csvConverter = new Converter({
                            constructResult: true
                        });
                        csvConverter.on("end_parsed", async(function(jsonObj) {
                            await (db.tx(async(t => {
                                // creating a sequence of transaction queries: 
                                var length = Object.keys(jsonObj).length;

                                var dataArray = new Array();
                                for (var i = 0; i < length; i++) {
                                    console.log("processing: " + (i));
                                    var name = jsonObj[i].name;
                                    var year = jsonObj[i].year;
                                    var battle_number = jsonObj[i].battle_number;
                                    var attacker_king = jsonObj[i].attacker_king;
                                    var defender_king = jsonObj[i].defender_king;
                                    var attacker_1 = jsonObj[i].attacker_1;
                                    var attacker_2 = jsonObj[i].attacker_2;
                                    var attacker_3 = jsonObj[i].attacker_3;
                                    var attacker_4 = jsonObj[i].attacker_4;
                                    var defender_1 = jsonObj[i].defender_1;
                                    var defender_2 = jsonObj[i].defender_2;
                                    var defender_3 = jsonObj[i].defender_3;
                                    var defender_4 = jsonObj[i].defender_4;
                                    var attacker_outcome = jsonObj[i].attacker_outcome;
                                    var battle_type = jsonObj[i].battle_type;
                                    var major_death = jsonObj[i].major_death;
                                    var major_capture = jsonObj[i].major_capture;
                                    var attacker_Size = jsonObj[i].attacker_Size;
                                    var defender_size = jsonObj[i].defender_size;
                                    var attacker_commander = jsonObj[i].attacker_commander;
                                    var defender_commander = jsonObj[i].defender_commander;
                                    var summer = jsonObj[i].summer;
                                    var location = jsonObj[i].location;;
                                    var region = jsonObj[i].region;
                                    var note = jsonObj[i].note;
                                    
                                    var procName = "new_battle_ins";
                                    var error_code = 0;

                                    var params = [-1,
                                        year ,
                                        battle_number ,
                                        attacker_king ,
                                        defender_king ,
                                        attacker_1 ,
                                        attacker_2 ,
                                        attacker_3 ,
                                        attacker_4 ,
                                        defender_1 ,
                                        defender_2 ,
                                        defender_3 ,
                                        defender_4 ,
                                        attacker_outcome ,
                                        battle_type ,
                                        major_death ,
                                        major_capture ,
                                        attacker_Size,
                                        defender_size,
                                        attacker_commander ,
                                        defender_commander ,
                                        summer ,
                                        location ,
                                        region ,
                                        note 
                                    ];


                                    console.log("parameters are:" + params);
                                    /*Global function to execute a procedure */

                                    var data = await (executeFunction(procName, params, t, res));
                                    console.log("Data Array : " + data[0].out_error_code);
                                    error_code = data[0].out_error_code;
                                    if (error_code == 0) {
                                        console.log("added successfully");
                                    } else {
                                        error_code += "";
                                        
                                    }

                                }
                            })).then(data => {
                                res.status(200).json({ success: true, msg: "uploaded successfully in database" });
                            }).catch(error => {
                                //console.log(error.code);
                                console.log(error);
                                if (error.rowIndex !== undefined)
                                    console.log("INDEX : " + error.rowIndex);
                                /*Fetches definition for error code and provides the response*/
                                //fetchErrorDefCSVUpload(error_code, res, req);
                                res.status(200).json({ success: false, msg: "Invalid data at row : " + error.rowIndex });
                            }));
                        }));
                        fileStream.pipe(csvConverter);
                    });
                }));
        } catch (err) {
            ErrorLogger("Error in upload" + err);
            sendResponse(req, res, 500, { success: false, msg: 'UPLOAD_ERROR' });
        }
    }
}));



router.get('/list_location',function(req,res,next){
    var selectquery = "select distinct location from battle_def";
    db.result(selectquery)
        .then(result => {
            var result1=result.rows;
            var data=[];
            data=_.pluck(result1,'location')
           res.status(200).json({ success: true, battleData: data });
        //  res.render('admin/report_location', {battleData: data});
        }).catch(err => {
            ErrorLogger("Error in selectquery : " + err);
            res.status(500).json({ success: false, msg: SERVER_ERROR  });
        })
})

router.get('/count_battle',function(req,res,next){
    var countquery = "select count(*) from battle_def";
    db.result(countquery)
        .then(countResult => {
           // res.render('admin/count_battle', {battleCount: countResult.rows[0].count});
            res.status(200).json({ success: true, battleCount: countResult.rows[0].count });
        }).catch(err => {
            ErrorLogger("Error in selectquery : " + err);
            res.status(500).json({ success: false, msg: SERVER_ERROR  });
        })
});

router.get('/search',function(req,res,next){
    var parameters = req.query;
    var attacker_king,location,type;
    if(parameters.attacker_king!=null || parameters.attacker_king!=undefined){
        parameters.attacker_king.toLowerCase();
    }  if(parameters.location!=null || parameters.location!=undefined){
        parameters.location.toLowerCase();
    }  if(parameters.type!=null || parameters.type!=undefined){
        parameters.type.toLowerCase();
    }
    
    (!_.isEmpty(parameters) && (parameters.attacker_king)) ? attacker_king = parameters.attacker_king : attacker_king = null;
    (!_.isEmpty(parameters) && (parameters.location)) ? location = parameters.location : location = null;
    (!_.isEmpty(parameters) && (parameters.type)) ? type = parameters.type : type = null;
    var selectQuery = "select * from battle_def ";
    if(attacker_king==undefined && location==undefined && type==undefined){
         selectquery = selectQuery;   
    }else{
         selectquery = selectQuery + " where lower(attacker_king)='"+
        attacker_king + "'"+ " or lower(location)='" + location + "'"+" or lower(battle_type)='" + type+"'";    
    }
   
    db.result(selectquery)
        .then(result => {
            res.status(200).json({ success: true, battleSearch: result.rows });
        }).catch(err => {
            ErrorLogger("Error in selectquery : " + err);
            res.status(500).json({ success: false, msg: SERVER_ERROR  });
        })
});

router.get('/stats',function(req,res,next){
    var query = "select * from get_status()";
  
    db.result(query)
        .then(Result => {
            let data = JSON.parse(Result.rows[0].get_status)
            var details={};
            details.attacker_outcomes=_.flatten(data.attacker_outcomes,true);
            details.most_active=_.flatten(data.most_active,true);
            details.size=data.size;
            details.battle_type=_.pluck(data.battle_types,'battle_type')
            res.status(200).json({ success: true, status:details});
        }).catch(err => {
            ErrorLogger("Error in selectquery : " + err);
            res.status(500).json({ success: false, msg: SERVER_ERROR  });
        }) 
})


module.exports = router;