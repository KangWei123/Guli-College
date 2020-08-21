// 导入发送异步请求的request方法.项目中所有的异步请求都是调用request方法实现的
import request from "@utils/request";

const BASE_URL = '/admin/edu'

// 章节管理 - 获取章节分页列表
// http://localhost:5000/admin/edu/chapter/:page/:limit
export function reqgetChapterList(courseId) {
  return request({
    url: `${BASE_URL}/chapter/1/10`,
    method: 'GET',
    params: {
      courseId
    }
  })
}