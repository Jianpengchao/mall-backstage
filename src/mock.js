const Mock = require("mockjs");//引入mock
const Random = Mock.Random // Mock.Random 是一个工具类，用于生成各种随机数据
let data = Mock.mock({
    "data|12": [ //生成100条数据 数组
        {
            "key|+1": 1,//生成商品id，自增1
            "description": "@ctitle(10)", //生成商品信息，长度为10个汉字
            "name": "@cname",//生成商品名 ， 都是中国人的名字
            // "shopTel": /^1(5|3|7|8)[0-9]{9}$/,//生成随机电话号
            // "salesVolume|30-50": 30, //随机生成商品价格 在30-1000之间
			// "shopHd":Random.name(), // 生成姓名
            // "shopLogo": "@Image('100x40','#c33', '#ffffff','小北鼻')", //生成随机图片，大小/背景色/字体颜色/文字信息
        }
    ]
})
Mock.mock(/vue-element-admin\/department/, 'get', () => { //三个参数。第一个路径，第二个请求方式post/get，第三个回调，返回值
    return data
})
