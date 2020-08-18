import React, { Component } from "react";
import { Button, Table, Tooltip, Input, message } from "antd";
import { PlusOutlined, FormOutlined, DeleteOutlined } from "@ant-design/icons";
import "./index.less";

import {
	getSubjectList,
	getSecSubjectList,
	updateSubjectList,
} from "./redux/index";
import { connect } from "react-redux";
import { reqUpdateSubject } from "@api/edu/subject";

const data = [
	{
		key: 1,
		name: "John Brown",
		age: 32,
	},
	{
		key: 2,
		name: "Jim Green",
		age: 42,
	},
	{
		key: 3,
		name: "Not Expandable",
		age: 29,
	},
	{
		key: 4,
		name: "Joe Black",
		age: 32,
	},
];

@connect((state) => ({ subjectList: state.subjectList }), {
	getSubjectList,
	getSecSubjectList,
	updateSubjectList,
})
class Subject extends Component {
	state = {
		subjectId: "",
		title: "",
	};

	current = 1;
	componentDidMount() {
		this.props.getSubjectList(1, 5);
	}
	//点击切换 页面数据的回调
	handleChange = (page, pageSize) => {
		this.props.getSubjectList(page, pageSize);
		this.current = page;
	};
	handleShowSizeChange = (page, pageSize) => {
		this.props.getSubjectList(page, pageSize);
		this.current = page;
	};
	// 点击新建按钮 跳转到新建页面
	handleToAdd = () => {
		this.props.history.push("/edu/subject/add");
	};

	//点击修改按钮
	handleUpdate = (record) => () => {
		this.setState({
			subjectId: record._id,
			title: record.title,
		});
		this.title = record.title;
	};
	//点击取消按钮
	handleCancel = () => () => {
		this.setState({
			subjectId: "",
		});
	};
	//点击确认按钮
	handleConfirm = (record) => async () => {
		console.log(this.state.title);
		if (!this.state.title.trim()) {
			message.warning("请输入正确内容");
			return;
		}
		if (this.state.title === this.title) {
			message.warning("请不要输入重复内容");
			return;
		}
		//--------------------------------------
		await this.props.updateSubjectList(this.state.subjectId, this.state.title);
		// await reqUpdateSubject(record._id, record.title);
		message.success("课程修改成功");
		this.setState({
			subjectId: "",
			title: "",
		});
		//--------------------------------------
		// this.props.getSubjectList(1, 10);
	};
	// 更改课程分类标题受控组件的事件处理函数
	handleUpdateChange = (e) => {
		this.setState({
			title: e.target.value,
		});
	};
	render() {
		const columns = [
			{
				title: "分类名称",
				// dataIndex: "title",
				key: "aa",
				render: (record) => {
					if (this.state.subjectId === record._id) {
						return (
							<Input
								style={{ width: 300 }}
								value={this.state.title}
								onChange={this.handleUpdateChange}
							></Input>
						);
					}
					return record.title;
				},
			},
			{
				title: "操作",
				dataIndex: "",
				key: "x",
				render: (record) => {
					if (this.state.subjectId === record._id) {
						return (
							<>
								<Button
									type="primary"
									style={{ marginRight: 20 }}
									onClick={this.handleConfirm(record)}
								>
									确认
								</Button>

								<Button type="danger" onClick={this.handleCancel(record)}>
									取消
								</Button>
							</>
						);
					} else {
						return (
							<>
								<Tooltip title="修改课程">
									<Button
										icon={<FormOutlined />}
										type="primary"
										style={{ marginRight: 20, width: 50 }}
										onClick={this.handleUpdate(record)}
									></Button>
								</Tooltip>
								<Tooltip title="删除课程">
									<Button
										icon={<DeleteOutlined />}
										type="danger"
										style={{ width: 50 }}
									></Button>
								</Tooltip>
							</>
						);
					}
				},
				width: 200,
			},
		];

		return (
			<div className="subject">
				<Button
					type="primary"
					icon={<PlusOutlined />}
					className="subject-button"
					onClick={this.handleToAdd}
				>
					新建
				</Button>
				<Table
					columns={columns}
					expandable={{
						// expandedRowRender: (record) => (
						// 	<p style={{ margin: 0 }}>{record.description}</p>
						// ),
						// rowExpandable: (record) => record.name !== "Not Expandable",
						onExpand: (expanded, record) => {
							// console.log(expanded, record);
							if (expanded) {
								//发送请求
								this.props.getSecSubjectList(record._id);
							}
						},
					}}
					dataSource={this.props.subjectList.items}
					rowKey="_id"
					pagination={{
						current: this.current,
						pageSizeOptions: ["2", "5", "10"], //选择每页显示多少条
						showQuickJumper: true, //跳转
						showSizeChanger: true, //是否展示 pageSize 切换器
						total: this.props.subjectList.total,
						// defaultPageSize: 5, //默认的每页条数
						onChange: this.handleChange, //页码改变的回调
						onShowSizeChange: this.handleShowSizeChange, //	pageSize 变化的回调
					}}
				/>
				,
			</div>
		);
	}
}
export default Subject;
