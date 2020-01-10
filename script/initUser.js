/**
 * Created by tangsicheng on 2018/3/14.
 */

print('---------------------------Mongodb Start Initialization ---------------------------');
print('---------------------------create collection "users" ---------------------------');
// mongo -u mutualfund -p mutualfund  10.1.96.121:31005/operation ./initUser.js

printjson(db.createCollection('users'));
printjson(db.users.update({"userName":"admin"},
    {
        userName: "admin",
        password: '$2a$10$PUfoSvW0tkoCKKT9yURukOF7CT4o/bmjdKaJbBhNakj.Wk0splCne' ,
        roles: ["admin"],
        token:'',
        createTime:new Date().getTime(),
        createBy:'init',
        updateTime:new Date().getTime(),
        updateBy:'init',
        isDeleted:0
    },
    {
        upsert:true
    }
));
