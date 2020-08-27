import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Row, Col, Tabs, message } from "antd";
import {
	UserOutlined,
	LockOutlined,
	MobileOutlined,
	MailOutlined,
	GithubOutlined,
	WechatOutlined,
	QqOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { login, mobileLogin } from "@redux/actions/login";
import { reqVerificationCode } from "@api/acl/oauth";
import "./index.less";
// 使用form表单-->动态校验

const { TabPane } = Tabs;
const validator = (rule, value) => {
	return new Promise((resolve, reject) => {
		if (!value.trim()) {
			return reject("不能为空");
		}
		if (value.length < 6) {
			return reject("至少六个字");
		}
		if (value.length > 16) {
			return reject("最多16个字");
		}
		if (!/^[a-zA-Z0-9_]+$/.test(value)) {
			return reject("只能写数字,字母,下划线");
		}
		return resolve();
	});
};
let loginType = "user";
function LoginForm(props) {
	const [form] = Form.useForm(); //得到form实例
	const [isShowBtn, setIsShowBtn] = useState(true);
	let [countiongDown, setCountiongDown] = useState(5);
	//点击登录
	const onFinish = () => {
		if (loginType === "user") {
			//账号密码登录
			//手动验证
			form.validateFields(["username", "password"]).then((res) => {
				const { username, password } = res;
				props.login(username, password).then((token) => {
					// 登录成功
					// console.log("登陆成功~");
					// 持久存储token
					localStorage.setItem("user_token", token);
					props.history.replace("/");
				});
			});
		} else {
			// 手机验证码登录
			form.validateFields(["phone", "verify"]).then((res) => {
				const { phone, verify } = res;
				props.mobileLogin(phone, verify).then((token) => {
					// 登录成功
					// console.log("登陆成功~");
					// 持久存储token
					localStorage.setItem("user_token", token);
					props.history.replace("/");
				});
			});
		}
	};
	//切换选项卡
	const tabOnChange = (values) => {
		loginType = values;
	};
	//点击获取验证码按钮
	const getCode = () => {
		//只校验phone表单项,不传参数就是校验所有内容
		form
			.validateFields(["phone"])
			.then(async (value) => {
				await reqVerificationCode(value.phone);
				message.success("验证码发送成功");
				//改变按钮状态
				setIsShowBtn(false);

				let timeId = setInterval(() => {
					setCountiongDown(--countiongDown);
					if (countiongDown <= 0) {
						setIsShowBtn(true);
						setCountiongDown(5);
						clearTimeout(timeId);
					}
				}, 1000);
			})
			.catch((err) => {
				//校验失败,触发catch
			});
	};
	//点击github登录
	const handleGitHubLogin = () => {
		// 修改浏览器地址栏地址,让浏览器发送请求给git.要上传client_id
		// 登记之后会获取到client_id
		//window.location.href 强制跳转/get请求
		window.location.href = `https://github.com/login/oauth/authorize?client_id=f61c2441724f47d34d83`;
	};
	return (
		<>
			<Form
				form={form}
				name="normal_login"
				className="login-form"
				initialValues={{ remember: true }}
			>
				<Tabs
					defaultActiveKey="user"
					tabBarStyle={{ display: "flex", justifyContent: "center" }}
					onChange={tabOnChange}
				>
					<TabPane tab="账户密码登陆" key="user">
						<Form.Item
							name="username"
							rules={[
								{ required: true, message: "必填项" },
								{
									pattern: /^[a-zA-Z0-9_]+$/,
									message: "只能输入英文,下划线和数字",
								},
								{
									min: 4,
									message: "不能少于4位",
								},
								{
									max: 16,
									message: "不能大于16位",
								},
							]}
						>
							<Input
								prefix={<UserOutlined className="form-icon" />}
								placeholder="用户名: admin"
							/>
						</Form.Item>
						<Form.Item name="password" rules={[{ validator }]}>
							<Input
								prefix={<LockOutlined className="form-icon" />}
								type="password"
								placeholder="密码: 111111"
							/>
						</Form.Item>
					</TabPane>
					<TabPane tab="手机号登陆" key="phone">
						<Form.Item
							name="phone"
							rules={[
								{ required: true, message: "请输入手机号" },
								{
									pattern: /^[\d]{11}$/,
									message: "请输入正确的手机号",
								},
							]}
						>
							<Input
								prefix={<MobileOutlined className="form-icon" />}
								placeholder="手机号"
							/>
						</Form.Item>

						<Row justify="space-between">
							<Col span={16}>
								<Form.Item
									name="verify"
									rules={[
										{
											required: true,
											message: "请输入验证码",
										},
										{
											pattern: /^[\d]{6}$/,
											message: "验证码格式不正确",
										},
									]}
								>
									<Input
										prefix={<MailOutlined className="form-icon" />}
										placeholder="验证码"
									/>
								</Form.Item>
							</Col>
							<Col span={7}>
								<Button
									className="verify-btn"
									onClick={getCode}
									disabled={isShowBtn ? false : true}
								>
									{isShowBtn === true
										? "获取验证码"
										: `${countiongDown}秒后重发`}
								</Button>
							</Col>
						</Row>
					</TabPane>
				</Tabs>
				<Row justify="space-between">
					<Col span={7}>
						<Form.Item name="remember" valuePropName="checked" noStyle>
							<Checkbox>自动登陆</Checkbox>
						</Form.Item>
					</Col>
					<Col span={5}>
						<Button type="link">忘记密码</Button>
					</Col>
				</Row>
				<Form.Item>
					<Button
						type="primary"
						onClick={onFinish}
						className="login-form-button"
					>
						登陆
					</Button>
				</Form.Item>
				<Form.Item>
					<Row justify="space-between">
						<Col span={16}>
							<span>
								其他登陆方式
								<GithubOutlined
									className="login-icon"
									onClick={handleGitHubLogin}
								/>
								<WechatOutlined className="login-icon" />
								<QqOutlined className="login-icon" />
							</span>
						</Col>
						<Col span={3}>
							<Button type="link">注册</Button>
						</Col>
					</Row>
				</Form.Item>
			</Form>
		</>
	);
}

export default withRouter(connect(null, { login, mobileLogin })(LoginForm));
