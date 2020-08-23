import React, { Component } from "react";
import { Card, Form, Input, Button, Divider, message, Switch, } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import MyUpLoad from '@comps/MyUpLoad'
import { addLesson } from '@api/edu/lesson'

//表单布局属性
const layout = {
  // antd把一个宽度分为24份
  // 表单文字描述部分
  labelCol: {
    span: 3
  },
  // 表单项部分
  wrapperCol: {
    span: 6
  }
}
export default class AddLesson extends Component {


  onFinish = async (values) => {
    // { chapterId, title, free, video }

    // console.log(this.props.location);
    let { title, free, video } = values
    let data = {
      title, free, video,
      chapterId: this.props.location.state._id
    }
    // console.log(data);
    await addLesson(data)
    message.success('添加课时成功')
    this.props.history.push('/edu/chapter/list')
  }

  render() {
    return <Card title={<>
      <Link to="/edu/chapter/list"><ArrowLeftOutlined /></Link>
      <span style={{ marginLeft: 20 }}>新增课时</span>
    </>}>
      <Form
        {...layout}
        initialValues={{
          free: true
        }}
        name='lesson'
        // 表单校验通过了会触发
        onFinish={this.onFinish}
      // 表单校验没有通过触发
      // onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label='课时名称'
          name='title'
          rules={[
            {
              required: true,
              message: '请输入课时名称!'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          valuePropName='checked'
          label='是否免费'
          name='free'
          rules={[
            {
              required: true,
              message: '请选择是否免费!'
            }
          ]}>
          <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked />
        </Form.Item>
        <Form.Item
          label='上传视频'
          name='video'
          rules={[
            {
              required: true,
              message: '请上传上传视频!'
            }
          ]}>
          <MyUpLoad></MyUpLoad>
        </Form.Item>
        <Form.Item>
          {/* htmlType的值是submit,表示这个按钮是一个提交按钮 */}
          <Button type='primary' htmlType='submit'>
            保存
            </Button>

        </Form.Item>
      </Form>
    </Card >;
  }
}
