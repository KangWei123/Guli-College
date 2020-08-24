import React, { useState, useEffect } from "react";
import { Form, Input, Select, Cascader, Button } from "antd";
import { reqAllSubject, reqSecSubject } from "@api/edu/subject";
import { reqGetAllTeacherList } from "@api/edu/teacher";
import { getCourseList } from "../redux";
import { connect } from "react-redux";
import "./index.less";
// 在要实现国际化的页面中
// 引入FormattedMessage
import { FormattedMessage } from "react-intl";

const { Option } = Select;

function SearchForm(props) {
	//定义数据
	const [subjects, setSubjects] = useState([]);
	const [teachers, setTeachers] = useState([]);
	const [options, setOptions] = useState([]);

	//生命周期
	useEffect(() => {
		async function fetchData() {
			// 这样的代码会让第一次请求执行完之后,才执行第二次请求
			// await reqAllSubjectList()
			// await reqGetAllTeacherList()
			// promise.all 会同时发送两次请求,两次请求都执行完毕,才会返回结果
			const [subject, teacher] = await Promise.all([
				reqAllSubject(),
				reqGetAllTeacherList(),
			]);
			setSubjects(subject);
			setTeachers(teacher);
			// 注意:setSubjects(subject) 执行完,不代表subjects修改完毕了
			const optionList = subject.map((item) => {
				//根据 andt 级联选择 的要求整理数据
				return {
					value: item._id, // 相当于_id
					label: item.title, // 相当于title
					isLeaf: false, // 是否有二级数据. false表示有, true表示没有
				};
			});
			setOptions(optionList);
		}
		fetchData();
	}, []);

	const [form] = Form.useForm();

	const onChange = (value, selectedOptions) => {
		console.log(value, selectedOptions);
	};

	const loadData = async (selectedOptions) => {
		// selectedOptions 记录了一级的数据和后面的其他级的数据
		// loadData什么时候触发: 只有有下一级数据就可以触发(有箭头就表示有下一级数据)
		// console.log(selectedOptions);
		// 永远获取最后一级的数据,因为要根据最后获取下一级数据
		const targetOption = selectedOptions[selectedOptions.length - 1];
		// 展示一个加载效果
		targetOption.loading = true;
		// load options lazily
		// 发送异步请求获取数据
		// 获取二级数据
		// console.log(targetOption);
		const res = await reqSecSubject(targetOption.value);
		// 让加载效果隐藏
		targetOption.loading = false;
		console.log(res);
		if (res.items.length) {
			//说明有数据,给targetOption添加children属性
			targetOption.children = res.items.map((item) => {
				return {
					value: item._id,
					label: item.title,
					// 注意: 因为我们知道二级后面没有数据了,
					//所以直接不写isLeaf.不写默认值就是true
				};
			});
		} else {
			// 没有拿到数据,就不填加children属性, 并且将isLeaf改为true.把小箭头去掉
			targetOption.isLeaf = true;
		}
		console.log(options);
		// 调用setOptions ,修改值让视图重新渲染
		setOptions([...options]);
	};
	//重置
	const resetForm = () => {
		form.resetFields();
	};
	//查询
	const onFinish = () => {
		//发送请求 获取数据
		props.getCourseList();
	};

	return (
		<Form layout="inline" form={form} onFinish={onFinish}>
			<Form.Item name="title" label={<FormattedMessage id="title" />}>
				<Input placeholder="课程标题" style={{ width: 250, marginRight: 20 }} />
			</Form.Item>
			<Form.Item name="teacherId" label={<FormattedMessage id="teacher" />}>
				<Select
					allowClear
					placeholder="课程讲师"
					style={{ width: 250, marginRight: 20 }}
				>
					{teachers.map((item) => (
						<Option value={item._id} key={item._id}>
							{item.name}
						</Option>
					))}
				</Select>
			</Form.Item>
			<Form.Item name="subject" label={<FormattedMessage id="subject" />}>
				<Cascader
					style={{ width: 250, marginRight: 20 }}
					options={options}
					// 点击菜单,如果有下一级数据,就会触发这个函数,一般在这个函数中获取下一级数据
					loadData={loadData}
					// 可以获取到选中的数据
					onChange={onChange}
					// changeOnSelect 值为true时,只要顶级了多级联动,就触发onchange. 为false时,只有选中之后才会触发
					// changeOnSelect = {true}
					// changeOnSelect
					placeholder="课程分类"
				/>
			</Form.Item>
			<Form.Item>
				<Button
					type="primary"
					htmlType="submit"
					style={{ margin: "0 10px 0 30px" }}
				>
					{/* 查询 */}
					<FormattedMessage id="serachBtn" />
				</Button>
				<Button onClick={resetForm}>
					{/* 重置 */}
					<FormattedMessage id="resetBtn" />
				</Button>
			</Form.Item>
		</Form>
	);
}

export default connect(null, { getCourseList })(SearchForm);
