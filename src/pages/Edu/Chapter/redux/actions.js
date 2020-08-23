import { reqgetCourseList, } from '@api/edu/course'
import { reqgetChapterList, reqBatchRemoveChapterList, reqBatchRemoveLessonList } from '@api/edu/chapter'
import { reqgetLessonList } from '@api/edu/lesson'
import { GET_COURSE_LIST, GET_CHAPTER_LIST, GET_LESSON_LIST, BACTH_REMOVE_CHAPTER_LIST, BACTH_REMOVE_LESSON_LIST } from './constans'

//获取所有课程列表
function getCourseListSync(data) {
  return { type: GET_COURSE_LIST, data }
}

export function getCourseList() {
  return (dispatch) => {
    reqgetCourseList().then(response => {
      dispatch(getCourseListSync(response))
    })
  }
}
//章节管理 - 获取章节分页列表
function getChapterListSync(data) {
  return { type: GET_CHAPTER_LIST, data }
}

export function getChapterList(courseId) {
  return (dispatch) => {
    return reqgetChapterList(courseId).then(response => {
      dispatch(getChapterListSync(response))
    })
  }
}

//章节管理 - 获取章节所有课时列表
function getLessonListSync(data) {
  return { type: GET_LESSON_LIST, data }
}

export function getLessonList(chapterId) {
  return (dispatch) => {
    return reqgetLessonList(chapterId).then(response => {
      dispatch(getLessonListSync({ response, chapterId }))
    })
  }
}

//批量删除章节-----------------------
function batchRemoveChapterListSync(data) {
  return { type: BACTH_REMOVE_CHAPTER_LIST, data }
}

export function batchRemoveChapterList(chapterIdList) {
  return (dispatch) => {
    return reqBatchRemoveChapterList(chapterIdList).then(response => {
      dispatch(batchRemoveChapterListSync(chapterIdList))
    })
  }
}


//批量删除课时-----------------------
function batchRemoveLessonListSync(data) {
  return { type: BACTH_REMOVE_LESSON_LIST, data }
}

export function batchRemoveLessonList(lessonIdList) {
  return (dispatch) => {
    return reqBatchRemoveLessonList(lessonIdList).then(response => {
      dispatch(batchRemoveLessonListSync(lessonIdList))
    })
  }
}