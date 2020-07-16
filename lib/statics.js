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
const elasticsearch = require("@elastic/elasticsearch");
const fs = require("fs-extra");
const path = require("path");
//================================================================================
// config
//================================================================================
const configElasticsearch = fs.readJsonSync(path.resolve(__dirname, "../conf/config.json"));

//================================================================================
// aliases
//================================================================================
/** declare here local variables aliasing some of often used imports / conf options */

//================================================================================
// module
//================================================================================
const esClient = new elasticsearch.Client(configElasticsearch);

module.exports.addObjectToIndex = function addObjectToIndex(data, targetIndex = configElasticsearch.index) {
    return Promise.try(() => {
        return esClient.create({
            id: Date.now(),
            index: targetIndex,
            body: data,
            type: "_doc"
        });
    });
};

module.exports.indexObject = function indexObject(data, targetIndex = configElasticsearch.index) {
    return Promise.try(() => {
        return esClient.index({
            id: Date.now(),
            index: targetIndex,
            body: data,
            type: "_doc"
        });
    });
};

module.exports.getInfos = function getInfos(targetIndex = configElasticsearch.index) {
    return Promise.try(() => {
        return esClient.cat.indices({
            index: targetIndex,
		format: "json",
		v: true
        });
    });
};

module.exports.getAllDocs = function getAllDocs(targetIndex = configElasticsearch.index) {
    return Promise.try(() => {
        return esClient.search({
            index: targetIndex,
            type: "_doc",
		body: { query: { "match_all": {} } }
        });
    });
};

module.exports.getDocument = function getDocument(targetID, targetIndex = configElasticsearch.index) {
    return Promise.try(() => {
        return esClient.get({
            index: targetIndex,
		id: targetID,
            type: "_doc"
        });
    });
};

module.exports.bulkIndex = function bulkIndex(type, data) {
    return Promise.try(() => {
        const bulkBody = [];
        data.forEach((item) => {
            bulkBody.push({
                index: {
                    _index: configElasticsearch.index, 
                    _type: type, 
                    _id: (item.id) ? item.id : Date.now(),}
            });
            bulkBody.push(item);	
        });

        esClient.bulk({
            index: configElasticsearch.index,
            body: bulkBody,
        })
            .then((response) => {
                console.log(response);
                return response;
            })
            .catch(console.error);
    });
    
};

module.exports.deleteIndex = function deleteIndex(index = configElasticsearch.index) {
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
