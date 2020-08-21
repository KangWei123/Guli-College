// 导入发送异步请求的request方法.项目中所有的异步请求都是调用request方法实现的
import request from "@utils/request";

const BASE_URL = '/admin/edu/lesson'

// 课时管理 - 获取章节所有课时列表 GET
// http://localhost:5000/admin/edu/lesson/get/:chapterId
export function reqgetLessonList(chapterId) {
  return request({
    url: `${BASE_URL}/get/${chapterId}`,
    method:'GET'
  })
}