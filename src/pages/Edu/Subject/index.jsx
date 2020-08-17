import React, { Component } from "react";
import { Button, Table, Tooltip } from "antd";
import { PlusOutlined, FormOutlined, DeleteOutlined } from "@ant-design/icons";
import "./index.less";

import { getSubjectList, getSecSubjectList } from "./redux/index";
import { connect } from "react-redux";

const columns = [
	{ title: "分类名称", dataIndex: "title", key: "aa" },
	{
		title: "操作",
		dataIndex: "",
		key: "x",
		render: () => (
			<>
				<Tooltip title="修改课程">
					<Button
						icon={<FormOutlined />}
						type="primary"
						style={{ marginRight: 20, width: 50 }}
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
		),
		width: 200,
	},
];

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
})
class Subject extends Component {
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
	current = 1;
	render() {
		return (
			<div className="subject">
				<Button
					type="primary"
					icon={<PlusOutlined />}
					className="subject-button"
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
