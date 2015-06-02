'use strict';


var os = require('os');
var request = require('request');
var stackSight;


function StackSight(options) {

    var options = options || {};
    if (!options.user || !options.app) throw new Error('stackSight must user and app');
    this.user = options.user || this.user;
    this.appId = options.appId || this.appId;
    this.app = options.app || this.app;

}

StackSight.index = function(data) {

    data.token = this.token;
    data.created = new Date();
    data.appId = this.app;
    data.loadavg = os.loadavg();
    data.freemem = os.freemem();
    data.totalmem = os.totalmem();
    data.cpus = os.cpus();

    var mapiOpt = {
        uri: 'https://network.mean.io/api/v0.1/index/' + data.index + '/' + data.type,
        method: 'POST',
        form: data,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    };

    delete mapiOpt.form.index;
    delete mapiOpt.form.type;

    request(mapiOpt, function(error, response, body) {});

};


(require('./core_modules/events')(StackSight));
(require('./core_modules/console')(StackSight));
// (require('./core_modules/sessions')(StackSight));

module.exports = function(options) {

    if (!stackSight)
        stackSight = new StackSight(options);

     if (stackSight.app)
        (require('./core_modules/requests')(StackSight, stackSight.app));

    return stackSight;
};

