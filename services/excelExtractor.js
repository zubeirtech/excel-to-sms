const xlsxFile = require('read-excel-file/node');


module.exports = {
    async extractExcel(fileName) {
        const numbers = [];
        await xlsxFile(`./files/${fileName}`).then((rows) => {
            rows.forEach(col => {                
                numbers.push(col[0].toString());
            });
        })            
        return numbers.join(",");
    }
}
