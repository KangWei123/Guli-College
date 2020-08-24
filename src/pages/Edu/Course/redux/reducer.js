import { GET_COURSE_LIST } from './constans'
const initCourseList = []
export function courseList(preState = initCourseList, action) {
  switch (action.type) {
    case GET_COURSE_LIST:
      return action.data
    default:
      return preState
  }
}