/**
 * Created by gonglinjie on 15-4-9.
 */
var request = require('request'),
    config = require('./server/config'),
    wtutil = require('./server/core/wtutil'),
    _ = require("lodash");

exports.run = function () {
    wtutil.get_token(function(err, obj){
        var access_token = obj.access_token;
        console.log(access_token);
        //先删除菜单，然后创建
        request.post({
            url: "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=" + access_token,
            json:  {
                "button":[
                    {
                        "type":"view",
                        "name":"工作台",
                        "url":"http://weixin.worktile.com"
                    },
                    {
                        "name":"解决方案",
                        "sub_button": [
                          {
                            "type":"view",
                            "name":"研发",
                            "url":"https://pro.worktile.com/solution/dev"
                          },
                          {
                            "type":"view",
                            "name":"电商",
                            "url":"https://pro.worktile.com/solution/ecommerce"
                          },
                          {
                            "type":"view",
                            "name":"最佳实践",
                            "url":"https://worktile.com/can"
                          }
                        ]
                    },
                    {
                        "name":"更多",
                        "sub_button":[
                            {
                                "type":"view",
                                "name":"下载应用",
                                "url":"http://a.app.qq.com/o/simple.jsp?pkgname=com.worktile"
                            },
                            {
                                "type":"view",
                                "name":"社区",
                                "url":"https://worktile.com/club"
                            },
                            {
                                "type":"click",
                                "name":"合作",
                                "key":"work_together"
                            },
                            {
                                "type":"view",
                                "name":"联系客户专员",
                                "url":"https://pro.worktile.com/zh-cn/specialist"
                            }]
                    }]
            }
        }, function(err, res, body){
            console.log(body)
        })
    });
};
exports.run();
