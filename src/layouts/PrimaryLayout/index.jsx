import React, { Component, Suspense } from "react";
import { Layout, Menu, Breadcrumb } from "antd";
import { defaultRoutes } from "@conf/routes";
import components from "@conf/asyncComps";
import {
	DesktopOutlined,
	PieChartOutlined,
	FileOutlined,
	TeamOutlined,
	UserOutlined,
	GlobalOutlined,
	MenuUnfoldOutlined,
	MenuFoldOutlined,
} from "@ant-design/icons";
import SiderMenu from "../SiderMenu";
import "./index.less";
import { withRouter, Route } from "react-router-dom";
import logo from "@assets/images/logo.png";
import { connect } from "react-redux";
const { Header, Content, Footer, Sider } = Layout;
@withRouter
@connect((state) => ({ user: state.user }))
class PrimaryLayout extends Component {
	state = {
		collapsed: false,
	};

	onCollapse = (collapsed) => {
		this.setState({ collapsed });
	};
	// 这个方法要调用两次:
	// 一次是传入defaultRoutes defaultRoutes没有children
	// 另一次传入的是后台获取的数据permissionList 有children
	//函数封装 返回对应组件--------------------------------------
	renderRoute = (routes, path) => {
		// 1. 如果component有值,要渲染Route
		// 2. 有children就遍历children
		return routes.map((route) => {
			if (route.component) {
				// 注意: component的值是一个字符串
				//所以需要导入asyncComps里面的组件, 拿到真正的组件
				const Components = components[route.component]();
				return (
					<Route
						key={route.path}
						path={path ? path + route.path : route.path}
						component={Components}
						exact
					></Route>
				);
			}
			// 有children就遍历children.
			//递归重新判断children里面有没有component, children
			if (route.children && route.children.length) {
				return this.renderRoute(route.children, route.path);
			}
		});
	};
	render() {
		const { name, avatar, permissionList } = this.props.user;
		// 使用正则,提取路径中的每一项
		// 正则后面加一个g, 表示提取所有匹配项
		const reg = /[/][a-z]*/g;
		const pathname = this.props.location.pathname;
		const matchArr = pathname.match(reg);
		// 如果matchArr的长度大于1,说明不是首页
		// 就要根据路径获取对应文字,然后动态渲染
		let FirstPathName;
		let SectPathName;
		if (matchArr.length > 1) {
			const FirstPath = matchArr[0];
			const SecPath = matchArr[1];
			const thirdPath = matchArr[2] || "";
			//遍历 用地址找到对应的数据 拿到对应的name 展示面包屑
			permissionList.forEach((item) => {
				if (item.path === FirstPath) {
					FirstPathName = item.name;
					// 遍历获取二级菜单名称
					item.children.forEach((i) => {
						const path = SecPath + thirdPath;
						if (i.path === path) {
							SectPathName = i.name;
						}
					});
				}
			});
		}

		return (
			<Layout className="layout" style={{ minHeight: "100vh" }}>
				{/* 收起 */}
				<Sider
					collapsible
					collapsed={this.state.collapsed}
					onCollapse={this.onCollapse}
				>
					<div className="logo">
						<img src={logo} alt="" />
						{!this.state.collapsed && <h1>硅谷教育管理系统</h1>}
					</div>
					{/* 目录 */}
					<SiderMenu></SiderMenu>
					<div style={{ height: 48, background: "transparent" }}></div>
				</Sider>

				<Layout className="site-layout">
					<Header className="layout-header">
						<img src={avatar} alt="" />
						<span>{name}</span>
						<GlobalOutlined />
					</Header>
					<Content>
						<div className="layout-nav">
							{matchArr.length === 1 ? (
								"首页"
							) : (
								<Breadcrumb>
									<Breadcrumb.Item>{FirstPathName}</Breadcrumb.Item>
									<Breadcrumb.Item>{SectPathName}</Breadcrumb.Item>
								</Breadcrumb>
							)}
							<div style={{ fontSize: 18, fontWeight: "bold" }}>
								{SectPathName}
							</div>
						</div>
						<div className="layout-content">
							<Suspense fallback="正在加载中...">
								{/* 调用函数 渲染对应组件内容 */}
								{this.renderRoute(defaultRoutes)}
								{this.renderRoute(this.props.user.permissionList)}
							</Suspense>
						</div>
					</Content>
					<Footer style={{ textAlign: "center" }}>
						Ant Design ©2018 Created by Ant UED
					</Footer>
				</Layout>
			</Layout>
		);
	}
}
export default PrimaryLayout;
