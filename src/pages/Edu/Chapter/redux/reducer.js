import { GET_COURSE_LIST, GET_CHAPTER_LIST, GET_LESSON_LIST, BACTH_REMOVE_CHAPTER_LIST, BACTH_REMOVE_LESSON_LIST } from './constans'
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
    case BACTH_REMOVE_CHAPTER_LIST:
      const chapterIdList = action.data//要删除的章节id
      let newChapterList2 = [...preState.chapterList]
      newChapterList2 = newChapterList2.filter(item => {
        if (chapterIdList.indexOf(item._id) > -1) {//找到了
          return false
        }
        return true
      })
      return {
        ...preState,
        chapterList: newChapterList2
      }
    case BACTH_REMOVE_LESSON_LIST:
      const lessonIdList = action.data//要删除的课程id
      console.log(lessonIdList);
      const newChapterList3 = [...preState.chapterList]
      newChapterList3.forEach(item => {
        item.children = item.children.filter(childrenItem => {
          if (lessonIdList.indexOf(childrenItem._id) > -1) {//找到了
            return false
          }
          return true
        })
        console.log(item.children);
      })
      return {
        ...preState,
        chapterList: newChapterList3
      }
    default:
      return preState
  }
}