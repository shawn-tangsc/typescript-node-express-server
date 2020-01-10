const NodeRSA = require('node-rsa');
const fs = require('fs')
function generator() {
    var key = new NodeRSA({ b: 1024 })
    var pubkey = key.exportKey('pkcs8-public');//导出公钥
    var prikey = key.exportKey('pkcs8-private');//导出私钥

    fs.writeFile('./pem/public_1024.pem', pubkey, (err) => {
        if (err) throw err
        console.log('公钥已保存！')
    })
    fs.writeFile('./pem/private_1024.pem', prikey, (err) => {
        if (err) throw err
        console.log('私钥已保存！')
    })
}
generator();
