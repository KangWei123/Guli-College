import { GET_USER_MENU, GET_USER_INFO } from './constants'
const initUserInfo = {
  name: " ",
  avatar: "",
  permissionValueList: [],
  permissionList: []
}
export function user(preState = initUserInfo, action) {
  switch (action.type) {
    case GET_USER_MENU:
      return {
        ...preState,
        ...action.data
      }
    case GET_USER_INFO:
      return {
        ...preState,
        ...action.data
      }
    default:
      return preState
  }
}