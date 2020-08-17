import {
  reqSubject,
  reqSecSubject
} from "@api/edu/subject";
//引入请求 api函数
import {
  GET_SUBJECT_LIST, GET_SEC_SUBJECT_LIST
} from "./constants";

/**
 * 获取一级课程分类
 */

const getSubjectListSync = (list) => ({
  type: GET_SUBJECT_LIST,
  data: list,
});

export const getSubjectList = (page, limit) => {
  return (dispatch) => {//reqSubject请求函数
    return reqSubject(page, limit).then((response) => {
      dispatch(getSubjectListSync(response));
      return response.total;
    });
  };
};

/**
 * 获取二级课程分类
 */

const getSecSubjectListSync = (list) => ({
  type: GET_SEC_SUBJECT_LIST,
  data: list,
});

export const getSecSubjectList = (parentId) => {
  return (dispatch) => {//reqSubject请求函数
    return reqSecSubject(parentId).then((response) => {
      dispatch(getSecSubjectListSync(response));
      console.log(11)
      return response.total;
    });
  };
};

