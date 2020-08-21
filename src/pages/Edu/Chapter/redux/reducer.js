import { GET_COURSE_LIST, GET_CHAPTER_LIST, GET_LESSON_LIST } from './constans'
const courseInit = {
  courseList: [],
  chapterList: []
}
export function chapterReducer(preState = courseInit, action) {
  switch (action.type) {
    case GET_COURSE_LIST:
      return {
        ...preState,
        courseList: action.data
      }
    case GET_CHAPTER_LIST:
      action.data.items.forEach(item => {
        item.children = []
      })
      return {
        ...preState,
        chapterList: action.data.items
      }
    case GET_LESSON_LIST:
      // action.data.response 二级数据
      const newChapterList = [...preState.chapterList]
      newChapterList.forEach(item => {
        if (item._id === action.data.chapterId) {
          item.children = action.data.response
        }
      })
      return {
        ...preState,
        chapterList: newChapterList
      }
    default:
      return preState
  }
}