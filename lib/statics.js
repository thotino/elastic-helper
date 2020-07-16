/**
 * project JSDoc description
 * @module {Object} module name
 * @version 1.0.0
 * @author author name
 * @requires dependency 1
 * @requires dependency 2
 * ...
 */

"use strict";

//================================================================================
// dependencies
//================================================================================
const Promise = global.Promise = require("bluebird");
const elasticsearch = require("elasticsearch");
const fs = require("fs-extra");
//================================================================================
// config
//================================================================================
const configElasticsearch = fs.readJsonSync("./conf/config.json");

//================================================================================
// aliases
//================================================================================
/** declare here local variables aliasing some of often used imports / conf options */

//================================================================================
// module
//================================================================================
const esClient = new elasticsearch.Client(configElasticsearch);

const bulkIndex = function bulkIndex(data) {
    return Promise.try(() => {
        esClient.bulk({body: data})
            .then((response) => {
                console.log(response);
                return response;
            })
            .catch(console.error);
    });
    
};

const deleteIndex = function deleteIndex(index = configElasticsearch.index) {
    return Promise.try(() => {
        return esClient.indices.delete({
            index: index,
        })
        .then((resp) => { return resp; })
        .catch((err) => { throw err; });
    });
};

// esClient.info();
// esClient.delete({index: configElasticsearch.index});
// esClient.deleteByQuery({index: configElasticsearch.index});
