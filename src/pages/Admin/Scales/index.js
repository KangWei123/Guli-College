import React, { Component } from 'react'
import { Card, Button, DatePicker } from 'antd'
import moment from 'moment'
// 导入angePicke
const { RangePicker } = DatePicker;
//数据
const tabListNoTitle = [
  {
    key: 'scales',
    tab: '销售量',
  },
  {
    key: 'visits',
    tab: '访问量',
  },
];
//匹配显示内容
const contentListNoTitle = {
  scales: <p>scales content</p>,
  visits: <p>visits content</p>,
};
export default class index extends Component {
  state = {
    noTitleKey: 'scales',
    dataFlag: 'day',
    rangTime: [moment(), moment()]
  }
  //选中切换回调
  onTabChange = (key) => {
    this.setState({
      noTitleKey: key
    })
  }
  //高亮
  handleDateActive = options => () => {
    let rangTime = []
    switch (options) {
      case 'day':
        rangTime = [moment(), moment()]
        break
      case 'week':
        rangTime = [moment(), moment().add(7, 'd')]
        break
      case 'month':
        rangTime = [moment(), moment().add(1, 'M')]
        break
      case 'year':
        rangTime = [moment(), moment().add(1, 'y')]
        break
    }
    this.setState({
      //高亮
      dataFlag: options,
      //动态日期
      rangTime
    })
  }
  handleTimeOnChange = (dates, dateStrings) => {
    // dates -> [moment,moment] 选中的日期的moment对象数组
    // dateStrings -> ['日期字符串','日期字符串']
    this.setState({
      rangTime: dates
    })
  }
  render() {
    //右侧内容
    const extra = (
      <>
        <Button type={this.state.dataFlag === 'day' ? 'link' : 'text'} onClick={this.handleDateActive('day')}>今日</Button>
        <Button type={this.state.dataFlag === 'week' ? 'link' : 'text'} onClick={this.handleDateActive('week')}>本周</Button>
        <Button type={this.state.dataFlag === 'month' ? 'link' : 'text'} onClick={this.handleDateActive('month')}>本月</Button>
        <Button type={this.state.dataFlag === 'year' ? 'link' : 'text'} onClick={this.handleDateActive('year')}>本年</Button>
        <RangePicker value={this.state.rangTime} onChange={this.handleTimeOnChange}></RangePicker>
      </>
    )
    return (
      <Card
        style={{ width: '100%' }}
        //数据
        tabList={tabListNoTitle}
        // 高亮
        activeTabKey={this.state.noTitleKey}
        // 右侧内容
        tabBarExtraContent={extra}
        //选中切换回调
        onTabChange={this.onTabChange}
      >
        {/* 显示内容 */}
        {contentListNoTitle[this.state.noTitleKey]}
      </Card>
    )
  }
}
