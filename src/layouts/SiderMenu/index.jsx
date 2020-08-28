import React, { Component } from "react";
import { Layout, Menu, Breadcrumb } from "antd";
import icons from "@conf/icons";
import { connect } from "react-redux";
import { defaultRoutes } from "@conf/routes";
import { Link, withRouter } from "react-router-dom";
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
const { SubMenu } = Menu;
@withRouter
@connect((state) => ({ permissionList: state.user.permissionList }))
class SiderMenu extends Component {
	renderMenu = (dataList) => {
		return dataList.map((data) => {
			// hidden值 false为渲染, true为不渲染
			if (data.hidden) return;
			const Icon = icons[data.icon]; //获取icon
			// 说明有二级菜单, 要渲染SubMenu
			if (data.children && data.children.length) {
				return (
					<SubMenu key={data.path} icon={<Icon />} title={data.name}>
						{data.children.map((secItem) => {
							// 判断hidden值
							if (secItem.hidden) return;
							return (
								<Menu.Item key={data.path + secItem.path}>
									<Link to={data.path + secItem.path}>{secItem.name}</Link>
								</Menu.Item>
							);
						})}
					</SubMenu>
				);
			} else {
				// 说明只有一级菜单, 只渲染Menu.Item
				return (
					<Menu.Item key={data.path} icon={<Icon />}>
						{data.path === "/" ? (
							<Link to={data.path}>{data.name}</Link>
						) : (
							data.name
						)}
					</Menu.Item>
				);
			}
		});
	};
	render() {
		const { pathname } = this.props.location;
		const pathKey =
			pathname.match(/[/][a-z]+/) && pathname.match(/[/][a-z]+/)[0];
		// /从数组的第0项,拿到一级菜单路径
		return (
			<Menu
				theme="dark"
				defaultSelectedKeys={[pathname]}
				defaultOpenKeys={[pathKey]}
				mode="inline"
			>
				
				{this.renderMenu(defaultRoutes)}
				{this.renderMenu(this.props.permissionList)}
				{/* <Menu.Item key="1" icon={<PieChartOutlined />}>
					Option 1
				</Menu.Item>
				<Menu.Item key="2" icon={<DesktopOutlined />}>
					Option 2
				</Menu.Item>
				<SubMenu key="sub1" icon={<UserOutlined />} title="User">
					<Menu.Item key="3">Tom</Menu.Item>
					<Menu.Item key="4">Bill</Menu.Item>
					<Menu.Item key="5">Alex</Menu.Item>
				</SubMenu>
				<SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
					<Menu.Item key="6">Team 1</Menu.Item>
					<Menu.Item key="8">Team 2</Menu.Item>
				</SubMenu>
				<Menu.Item key="9" icon={<FileOutlined />} /> */}
			</Menu>
		);
	}
}
export default SiderMenu;
