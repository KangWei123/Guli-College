import React, { Component } from "react";
import { Card, Form, Input, Select, Button, Divider, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { reqSubject, reqAddSubject } from '@api/edu/subject'

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
export default class AddSubject extends Component {
	page = 1 // 存储要获取第几页 (页数)
	state = {
		total: '',
		items: [],
	}
	async componentDidMount() {
		let result = await reqSubject(this.page++, 10)
		this.setState(result)
	}

	// 点击加载更多数据,去获取一级课程分类的数据
	handleGetSubject = async () => {

		let result = await reqSubject(this.page++, 10)
		// 这里拿到的数据是第2,3,4.. 页的数据,需要新的数据和原来的数据拼接起来
		const newItems = [...this.state.items, ...result.items]
		this.setState({
			items: newItems
		})
	}

	// 点击提交按钮,表单校验通过会触发的回调函数
	onFinish = async (values) => {
		// 给后台发送请求
		await reqAddSubject(values.subjectname, values.parentid)
		message.success('添加课程分类成功')
		// 添加成功之后,跳回到list页面
		this.props.history.push('/edu/subject/list')
	}

	render() {
		return <Card title={<><Link to="/edu/subject/List"><ArrowLeftOutlined /></Link><span style={{ marginLeft: 20 }}>新增课程</span></>}>
			<Form
				{...layout}
				name='subject'
				// 表单校验通过了会触发
				onFinish={this.onFinish}
			// 表单校验没有通过触发
			// onFinishFailed={onFinishFailed}
			>
				<Form.Item
					label='课程分类名称'
					name='subjectname'
					rules={[
						{
							required: true,
							message: '请输入课程分类!'
						}
					]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					label='父级分类id'
					name='parentid'
					rules={[
						{
							required: true,
							message: '请选择分类id'
						}
					]}
				>
					<Select dropdownRender={menu => (
						<div>
							{menu}
							<Divider style={{ margin: '4px 0' }} />
							{this.state.total <= this.state.items.length ?
								(<div style={{ color: 'red', marginLeft: 10 }}>没有更多数据了</div>) :
								(<Button type='link' onClick={this.handleGetSubject}>点击加载更多...</Button>
								)}
						</div>
					)}>
						<Select.Option value={1}>
							{'一级菜单'}
						</Select.Option>
						{this.state.items.map(item => (<Select.Option value={item._id} key={item._id}>
							{item.title}
						</Select.Option>))}
					</Select>
				</Form.Item>

				<Form.Item>
					{/* htmlType的值是submit,表示这个按钮是一个提交按钮 */}
					<Button type='primary' htmlType='submit'>
						保存
          </Button>
				</Form.Item>
			</Form>
		</Card>;
	}
}
