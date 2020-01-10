/**
 * Created by tangsicheng on 2018/3/14.
 */
const bcrypt = require('bcryptjs');

let password = 'admin'   //获取注册页面上表单输入的密码

//生成salt的迭代次数
const saltRounds = 10;
//随机生成salt
const salt = bcrypt.genSaltSync(saltRounds);
//获取hash值
let hash = bcrypt.hashSync(password, salt);
console.log(`经过bcryptjs 加密${password}后，得到结果为：`);
console.log(hash);
console.log(`加密结束`);

let crypto = require('crypto');


// crypto加密解密
//加密开始
let str = JSON.stringify(password); //明文
let secret = 'BETA'; //密钥
let cipher = crypto.createCipher('aes192', secret);
let enc = cipher.update(str, 'utf8', 'hex'); //编码方式从utf-8转为hex;
enc += cipher.final('hex'); //编码方式从转为hex;
console.log(enc)//输出加密后结果
//解密开始
let ss = enc; //这是user加密后的结果	赋值给变量ss
let decipher = crypto.createDecipher('aes192', secret);
let dec = decipher.update(ss, 'hex', 'utf8'); //编码方式从hex转为utf-8;
dec += decipher.final('utf8'); //编码方式从utf-8;
console.log(JSON.parse(dec)) //这是解密后的结果
//todo end
