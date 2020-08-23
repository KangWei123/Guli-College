// 导入发送异步请求的request方法.项目中所有的异步请求都是调用request方法实现的
import request from "@utils/request";

const BASE_URL = '/admin/edu/course'
// 课程管理 - 获取所有课程列表GET
// http://localhost:5000/admin/edu/course
export function reqgetCourseList() {
  return request({
    url: `${BASE_URL}`,
    method: 'GET'
  })
}




