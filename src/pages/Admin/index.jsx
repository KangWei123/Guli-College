import React, { Component } from "react";
import { Row, Col, Statistic, Progress } from "antd";
import Card from "@comps/Card";
import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import { AreaChart, ColumnChart } from "bizcharts";
import Scales from "./Scales";
// 数据源
const columdata = [
	{
		type: "家具家电",
		sales: 38,
	},
	{
		type: "粮油副食",
		sales: 52,
	},
	{
		type: "生鲜水果",
		sales: 61,
	},
	{
		type: "美容洗护",
		sales: 145,
	},
	{
		type: "母婴用品",
		sales: 48,
	},
	{
		type: "进口食品",
		sales: 38,
	},
	{
		type: "食品饮料",
		sales: 38,
	},
	{
		type: "家庭清洁",
		sales: 38,
	},
];
// 数据源
const data = [
	{ year: "1991", value: 3 },
	{ year: "1992", value: 4 },
	{ year: "1993", value: 3.5 },
	{ year: "1994", value: 5 },
	{ year: "1995", value: 8.9 },
	{ year: "1996", value: 6 },
	{ year: "1997", value: 7 },
	{ year: "1998", value: 9 },
	{ year: "1999", value: 13 },
];

const RowCol = {
	// xs, md, lg 表示不同的屏幕尺寸 具体见antd文档
	// span表示元素在行中占的格数
	// 一行共24个格
	xs: { span: 24 },
	md: { span: 12 },
	lg: { span: 6 },
};
export default class Admin extends Component {
	render() {
		return (
			<div>
				<Row gutter={[16, 16]}>
					<Col {...RowCol}>
						{/* Statistic 是antd中的同级数据的组件 prefix是数据前加前缀 value是数据值 */}
						<Card
							title={<Statistic title="总销售额" prefix="￥" value="389657" />}
							footer={<span>日销售额 ￥12,423</span>}
						>
							<span>
								周同比 12%
								<CaretUpOutlined style={{ color: "red", marginRight: 10 }} />
							</span>
							<span>
								日同比 10%
								<CaretDownOutlined style={{ color: "green" }} />
							</span>
						</Card>
					</Col>
					<Col {...RowCol}>
						<Card
							title={<Statistic title="总销售额" prefix="￥" value="845675" />}
							footer={<span>日销售额 ￥12,423</span>}
						>
							<AreaChart
								data={data}
								// title={{
								// 	visible: true,
								// 	text: "面积图",
								// }}
								xAxis={{
									visible: false,
								}}
								yAxis={{
									visible: false,
								}}
								padding="0"
								color="hotpink"
								xField="year"
								yField="value"
								smooth={true}
								meta={{
									year: {
										alias: "年份",
									},
									value: {
										alias: "数据量(万)",
									},
								}}
							/>
						</Card>
					</Col>
					<Col {...RowCol}>
						<Card
							title={<Statistic title="总销售额" prefix="￥" value="254875" />}
							footer={<span>日销售额 ￥12,423</span>}
						>
							<ColumnChart
								data={columdata}
								xAxis={{
									visible: false,
								}}
								yAxis={{
									visible: false,
								}}
								padding="0"
								xField="type"
								yField="sales"
								meta={{
									type: {
										alias: "类别",
									},
									sales: {
										alias: "销售额(万)",
									},
								}}
							/>
						</Card>
					</Col>
					<Col {...RowCol}>
						<Card
							title={<Statistic title="总销售额" prefix="￥" value="587954" />}
							footer={<span>日销售额 ￥12,423</span>}
						>
							<Progress
								strokeColor={{
									from: "#108ee9",
									to: "#87d068",
								}}
								percent={89.9}
								status="active"
							/>
						</Card>
					</Col>
				</Row>
				<Scales></Scales>
			</div>
		);
	}
}
