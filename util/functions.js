///////////////////////////////////////////////////////////////////////////////////////////////
//Method to get String representation of given JSON Object

global.toJSONString = function(object) {
        return JSON.stringify(object);
    }
//Global method to log info

var isErrLoggingEnabled = true,
    isInfoLoggingEnabled = true;


global.InfoLogger = function(message) {
    if (isInfoLoggingEnabled) {
        winstonLogger.info(message);
    }
};

//Global method to log error

global.ErrorLogger = function(message) {
        if (isErrLoggingEnabled) {
            winstonLogger.error(message);
        }
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////  

/**
 * Global method to execute db based procedures
 * @procName procedure name to be executed
 * @parameters array of values to be passed as arguments to procedure
 * @transaction reference for db transaction instance
 * @res response object used for redirection or sending response
 */
global.executeFunction = async(function(procName, parameters, transaction, res) {
    var data = await (transaction.func(procName, parameters)
        .then(function(data) {
            console.log(data);
            console.log("PRoc Name : " + procName);
            return JSON.parse(JSON.stringify(data));
        }).catch(function(err) {
            console.log(err);
            res.status(500).json({ success: false, msg: SERVER_ERROR });
        }));
    return data;
});


/**
 * Method to check whether given object is Array or not
 */
global.isArray = function(object) {
    if (Object.prototype.toString.call(object) === '[object Array]') {
        return true;
    } else {
        return false;
    }
}

/**
 * Method to check whether given object is String or not
 */
global.isString = function(object) {
    if (typeof object === 'string') {
        return true;
    } else {
        return false;
    }
}