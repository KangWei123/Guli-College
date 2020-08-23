import React, { Component } from 'react'
import { Button, message, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { reqgetUploadToken } from '@api/edu/lesson'
import * as qiniu from 'qiniu-js'
import { nanoid } from 'nanoid'
export default class MyUpLoad extends Component {
  constructor() {
    super()
    //判断之前是否有token
    let tokenObj = localStorage.getItem('TOKEN_OBJ')
    if (tokenObj) {
      //如果有 存储到当前对象中
      this.tokenObj = JSON.parse(tokenObj)
      return
    }
    this.tokenObj = {}//如果没有，赋值空对象
  }
  state = {
    isShowUpLoad: true,

  }
  beforeUpload = (file, fileList) => {
    // 上传文件之前的钩子 若返回 false 则停止上传
    //支持返回一个 Promise 对象，Promise 对象 reject 时则停止上传，resolve 时开始上传
    const MAX_SIZE = 10 * 1024 * 1024//10M
    return new Promise(async (resolve, reject) => {
      if (file.size > MAX_SIZE) {
        return reject('大于10M，不合规')
      }
      //---------------------------------------
      // 判断是否有token   判断是否超时  
      if (this.tokenObj.expires > Date.now()) {
        //如果 浏览器存储了token， 且没过去，不请求token
        return resolve()
      }
      //------否则发送请求
      console.log('请求token')
      //发请求，拿token
      const res = await reqgetUploadToken()
      //把超时时间计算出来，存储到token.expires ----因为请求需要时间 所以  减去去几秒 
      res.expires = Date.now() + res.expires * 1000 - 2 * 60 * 1000//2分钟
      //存token
      this.tokenObj = res
      localStorage.setItem('TOKEN_OBJ', JSON.stringify(res))
      resolve()
    })
  }
  customRequest = ({ file, onProgress, onError, onSuccess }) => {
    const observer = {
      next(res) {
        onProgress({ percent: res.total.percent })
      },
      error(err) {
        onError(err)
      },
      complete: (res) => {
        onSuccess(res)
        this.props.onChange('http://qfejn2na2.hn-bkt.clouddn.com/' + res.key)
        this.setState({
          isShowUpLoad: false
        })
        message.success('上传成功')
      }
    }
    const key = nanoid(10)
    const token = this.tokenObj.uploadToken
    console.log(this.tokenObj.uploadToken);
    const config = {
      region: qiniu.region.z2
    };
    const putExtra = {
      mimeType: "video/*",
    };
    const observable = qiniu.upload(file, key, token, putExtra, config)
    this.subscription = observable.subscribe(observer) // 上传开始
  }
  componentWillUnmount() {//组件卸载
    this.subscription && this.subscription.unsubscribe() // 上传取消
  }
  //移出视频时
  onRemove = () => {
    this.props.onChange('')
    this.setState({
      isShowUpLoad: true
    })
  }
  render() {
    return (
      <div>
        <Upload
          beforeUpload={this.beforeUpload}
          customRequest={this.customRequest}
          onRemove={this.onRemove}
        >
          {this.state.isShowUpLoad && (
            <Button>
              <UploadOutlined /> 上传视频
            </Button>
          )}

        </Upload>
      </div>
    )
  }
}
