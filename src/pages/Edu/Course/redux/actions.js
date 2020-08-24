import { reqgetCourseList } from '@api/edu/course'
import { GET_COURSE_LIST } from './constans'
function getCourseListSync(data) {
  return { type: GET_COURSE_LIST, data }
}
export function getCourseList() {
  return dispatch => {
    return reqgetCourseList().then(res => {
      dispatch(getCourseListSync(res))
    })
  }
}