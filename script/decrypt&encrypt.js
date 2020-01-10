const NodeRSA = require('node-rsa');
const fs = require('fs')
let value = ''
function encrypt() {
    fs.readFile('./pem/public_1024.pem', function (err, data) {
        var key = new NodeRSA(data);
        key.setOptions({ encryptionScheme: 'pkcs1' })
        let cipherText = key.encrypt('admin', 'base64','utf-8');
        value = cipherText
        console.log(value);
    });
}
//generator();
encrypt();

function decrypt() {
    fs.readFile('./pem/private_1024.pem', function (err, data) {
        var key = new NodeRSA(data);
        key.setOptions({ encryptionScheme: 'pkcs1' })
        let rawText = key.decrypt(value, 'utf-8');
        console.log(rawText);
    });
}
decrypt()

//
// function generateKeyPair(pkcsType,pkcsSize) {
//     pkcsType = pkcsType ? pkcsType : 'pkcs8';//不为空则 设置为传入参数，为空则 设置为 pkcs8
//     console.log('pkcsType=' + pkcsType);
//     pkcsSize = pkcsSize || 512;
//     //1.创建RSA对象，并指定 秘钥长度
//     var key = new NodeRSA({ b: pkcsSize });
//     key.setOptions({ encryptionScheme: 'pkcs1' });//指定加密格式
//
//     //2.生成 公钥私钥，使用 pkcs8标准，pem格式
//     var publicPem = key.exportKey(pkcsType+'-public-pem');//制定输出格式
//     var privatePem = key.exportKey(pkcsType + '-private-pem');
//     //console.log(key.$options);
//     console.log(pkcsType+'公钥:\n',publicPem);
//     console.log(pkcsType+'私钥:\n', privatePem);
//
//     //---------------------测试1：服务端私钥加密公钥解密------------------------
//
//     //3.使用 私钥 加密 数据，并指定 字符编码 和 字符集
//     var encryData = key.encrypt('服务端测试 -> jameszou love code~~~', 'base64','utf8');
//     console.log('\n私钥加密后的数据：\n', encryData); //加密后数据为 base64 编码
//
//     //4.使用 公钥 解密 数据，并指定字符集
//     var decryptData = key.decrypt(new Buffer('r66xnCBjxQLCuKZ70/+20iTU297sBD9srxMbHPkNZgyWa2c+YO+ytmJgHSiAo1n+p0Yvhu18tIL1w8JCV18uog=='),'utf8');
//     console.log('\n公钥解密后的数据：\n', decryptData);
//
//     //---------------------测试2：服务端加载公钥后解密------------------------
//     //1.创建RSA对象，并指定 秘钥长度
//     // var key3 = new NodeRSA({ b: pkcsSize });
//     // //2.导入 公钥，并指定使用 pkcs标准，pem格式
//     // key3.importKey(publicPem, pkcsType+'-public-pem');
//     //
//     // //3.使用 公钥 解密数据
//     // var decrypted = key3.decryptPublic(encryData, 'utf8');
//     // console.log('\n使用公钥解密后的数据：\n',decrypted);
// }
//
// generateKeyPair();
