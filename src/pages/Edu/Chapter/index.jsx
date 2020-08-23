import React, { Component } from "react";
import { Button, message, Tooltip, Modal, Alert, Table } from "antd";
import Player from "griffith";
import {
	FullscreenOutlined,
	RedoOutlined,
	SettingOutlined,
	InfoCircleOutlined,
	PlusOutlined,
	FormOutlined,
	DeleteOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";
import {
	getLessonList,
	batchRemoveChapterList,
	batchRemoveLessonList,
} from "./redux";
import { connect } from "react-redux";
import SearchForm from "./SearchForm";

import "./index.less";

dayjs.extend(relativeTime);

@connect(
	(state) => ({
		chapterList: state.chapterReducer.chapterList,
	}),
	{ getLessonList, batchRemoveChapterList, batchRemoveLessonList }
)
class Chapter extends Component {
	state = {
		searchLoading: false,
		previewVisible: false,
		previewImage: "",
		selectedRowKeys: [],
		play_url: "",
	};

	showImgModal = (img) => {
		return () => {
			this.setState({
				previewVisible: true,
				previewImage: img,
			});
		};
	};

	handleImgModal = () => {
		this.setState({
			previewVisible: false,
		});
	};

	componentDidMount() {
		// const { page, limit } = this.state;
		// this.handleTableChange(page, limit);
	}

	handleTableChange = (page, limit) => {
		this.setState({
			tableLoading: true,
		});

		this.getcourseList({ page, limit }).finally(() => {
			this.setState({
				tableLoading: false,
				page,
				limit,
			});
		});
	};

	getcourseList = ({ page, limit, Coursename, nickName }) => {
		return this.props
			.getcourseList({ page, limit, Coursename, nickName })
			.then((total) => {
				if (total === 0) {
					message.warning("暂无用户列表数据");
					return;
				}
				message.success("获取用户列表数据成功");
			});
	};

	onSelectChange = (selectedRowKeys) => {
		this.setState({
			selectedRowKeys,
		});
	};
	//点击展开
	handleGetLesson = (expanded, record) => {
		// 发送请求 添加数据
		if (expanded) {
			this.props.getLessonList(record._id);
		}
	};
	//点击 新增课程
	toAddLesson = (data) => () => {
		this.props.history.push("/edu/chapter/addlesson", data);
	};
	//点击预览视频
	handlePreviewViedo = (record) => () => {
		this.setState({
			previewVisible: true,
			play_url: record.video,
		});
	};
	//批量删除
	batchRemove = () => {
		//获取参数(章节idList/课时idList) ---> 发送请求
		const chapterList = this.props.chapterList; //章节数据
		const selectedRowKeys = this.state.selectedRowKeys; //选中的id(章节/课时都有)

		const chapterIdList = [];
		chapterList.filter((item) => {
			//章节id
			if (selectedRowKeys.indexOf(item._id) !== -1) {
				//找到了
				chapterIdList.push(item._id);
			}
			return false;
		});

		const lessonIdList = selectedRowKeys.filter((item) => {
			//所有id
			if (chapterIdList.indexOf(item) > -1) {
				return false;
			}
			return true;
		});
		console.log(chapterIdList, lessonIdList);
		this.props.batchRemoveChapterList(chapterIdList);
		this.props.batchRemoveLessonList(lessonIdList);
	};
	render() {
		const { previewVisible, previewImage, selectedRowKeys } = this.state;

		const columns = [
			{
				title: "章节名称",
				dataIndex: "title",
			},
			{
				title: "是否免费",
				dataIndex: "free",
				render: (isFree) => {
					return isFree === true ? "是" : isFree === false ? "否" : "";
				},
			},
			{
				title: "视频",
				// dataIndex: "_id",
				render: (record) => {
					if (record.free) {
						return (
							<Button onClick={this.handlePreviewViedo(record)}>
								预览视频
							</Button>
						);
					}
					return null;
				},
			},
			{
				title: "操作",
				width: 210,
				fixed: "right",
				render: (data) => {
					return (
						<div>
							<Tooltip title="新增课时">
								<Button type="primary" onClick={this.toAddLesson(data)}>
									<PlusOutlined />
								</Button>
							</Tooltip>
							<Tooltip title="更新章节">
								<Button type="primary" style={{ margin: "0 10px" }}>
									<FormOutlined />
								</Button>
							</Tooltip>
							<Tooltip title="删除章节">
								<Button type="danger">
									<DeleteOutlined />
								</Button>
							</Tooltip>
						</div>
					);
				},
			},
		];

		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange,
			// hideDefaultSelections: true,
			// selections: [
			//   Table.SELECTION_ALL,
			//   Table.SELECTION_INVERT,
			//   {
			//     key: "odd",
			//     text: "Select Odd Row",
			//     onSelect: changableRowKeys => {
			//       let newSelectedRowKeys = [];
			//       newSelectedRowKeys = changableRowKeys.filter((key, index) => {
			//         if (index % 2 !== 0) {
			//           return false;
			//         }
			//         return true;
			//       });
			//       this.setState({ selectedRowKeys: newSelectedRowKeys });
			//     }
			//   },
			//   {
			//     key: "even",
			//     text: "Select Even Row",
			//     onSelect: changableRowKeys => {
			//       let newSelectedRowKeys = [];
			//       newSelectedRowKeys = changableRowKeys.filter((key, index) => {
			//         if (index % 2 !== 0) {
			//           return true;
			//         }
			//         return false;
			//       });
			//       this.setState({ selectedRowKeys: newSelectedRowKeys });
			//     }
			//   }
			// ]
		};
		const sources = {
			//高清
			hd: {
				play_url: this.state.play_url,
				bitrate: 1,
				duration: 1000,
				format: "",
				height: 500,
				size: 160000,
				width: 500,
			},
			//标清
			// sd: {
			// 	play_url: "https://zhstatic.zhihu.com/cfe/griffith/zhihu2018_sd.mp4",
			// },
		};
		return (
			<div>
				<div className="course-search">
					<SearchForm />
				</div>
				<div className="course-table">
					<div className="course-table-header">
						<h3>课程章节列表</h3>
						<div>
							<Button type="primary" style={{ marginRight: 10 }}>
								<PlusOutlined />
								<span>新增</span>
							</Button>
							<Button
								type="danger"
								style={{ marginRight: 10 }}
								onClick={this.batchRemove}
							>
								<span>批量删除</span>
							</Button>
							<Tooltip title="全屏" className="course-table-btn">
								<FullscreenOutlined />
							</Tooltip>
							<Tooltip title="刷新" className="course-table-btn">
								<RedoOutlined />
							</Tooltip>
							<Tooltip title="设置" className="course-table-btn">
								<SettingOutlined />
							</Tooltip>
						</div>
					</div>
					<Alert
						message={
							<span>
								<InfoCircleOutlined
									style={{ marginRight: 10, color: "#1890ff" }}
								/>
								{`已选择 ${selectedRowKeys.length} 项`}
							</span>
						}
						type="info"
						style={{ marginBottom: 20 }}
					/>
					<Table
						rowSelection={rowSelection}
						columns={columns}
						dataSource={this.props.chapterList}
						rowKey="_id"
						expandable={{
							onExpand: this.handleGetLesson,
						}}
					/>
				</div>

				<Modal
					visible={previewVisible}
					title="预览视频"
					footer={null}
					onCancel={this.handleImgModal}
					destroyOnClose={true}
				>
					<Player
						sources={sources}
						id={"1"}
						duration={1000}
						cover={"http://localhost:3000/logo512.png"}
					></Player>
				</Modal>
			</div>
		);
	}
}

export default Chapter;
