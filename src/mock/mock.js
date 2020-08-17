// 项目中新建文件夹 mock
// /mock/server.js
// node 框架 express 快速开启一个服务器
const express = require('express')
// 需要下载  npm i mockjs
const Mock = require('mockjs')
// 得到一个app对象
const app = express()

// mockjs中随机类
const Random = Mock.Random

//随机中文, 这里调用即可
Random.ctitle()

// 解决跨域
// use是express中的一个中间件
app.use((req, res, next) => {
  //设置响应头
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Headers', 'content-type,token')
  res.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
  //调用下一个中间件
  next()
})

// 模拟请求
app.get('/admin/edu/subject/:page/:limit', (req, res) => {
  // 获取params参数
  const { page, limit } = req.params
  //模拟数据  利用mock模拟数据
  const data = Mock.mock({
    //Random.integer(min,max)返回min到max的随机数
    total: Random.integer(limit, limit * 2),
    // 数组长度是limit
    // item|num 表示item字段指向的数组的长度
    [`items|${limit}`]: [
      {
        // _id初始值为1, +1表示会递增
        'id|+1': 1,
        // @ctitle 会使用Random.ctitle生成随机标题,长度2~5
        title: '@ctitle(2,5)',
        // 如果当前课程分类数据是一级课程分类: 值为0. 如果是二级:parentId的值就是一级课程分类的_id的值
        parentId: 0
      }
    ]
  })

  //将data转成json字符串,并返回
  res.json({
    code: 20000,
    sucess: true,
    data,
    message: '' //响应信息
  })
})

app.listen(8888, err => {
  if (err) {
    console.log('服务器启动失败', err)
  }
  console.log('服务器启动成功~ localhost:5000')
})