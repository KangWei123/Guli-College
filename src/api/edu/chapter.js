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

// 章节管理 - 批量删除多个章节 DELETE
// http://localhost:5000/admin/edu/chapter/batchRemove
export function reqBatchRemoveChapterList(chapterIdList) {
  return request({
    url: `${BASE_URL}/chapter/batchRemove`,
    method: 'DELETE',
    data: {
      idList: chapterIdList
    }
  })
}

// 课时管理 - 批量删除多个课时 DELETE
// http://localhost:5000/admin/edu/lesson/batchRemove
export function reqBatchRemoveLessonList(lessonIdList) {
  return request({
    url: `/admin/edu/lesson/batchRemove`,
    method: 'DELETE',
    data: {
      idList: lessonIdList
    }
  })
}