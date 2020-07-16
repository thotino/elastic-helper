const helpers = require("../index");

// helpers.helpers.addObjectToIndex({foo: "bar"}).then((returnedData) => {  console.log(returnedData); });

helpers.helpers.bulkIndex("type-test", [{foo: "bar"}, {foo: "baz"},]).then((returnedData) => {  console.log(returnedData); });