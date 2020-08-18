import {
  reqSubject,
  reqSecSubject,
  reqUpdateSubject
} from "@api/edu/subject";
//引入请求 api函数
import {
  GET_SUBJECT_LIST, GET_SEC_SUBJECT_LIST, UPDATE_SUBJECT_LIST
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
      return response.total;
    });
  };
};

/**
 * 修改 更新页面
 */

const updateSubjectListSync = (data) => ({
  type: UPDATE_SUBJECT_LIST,
  data
});
//此处发送请求只是为了传递id与title，为了在redux里通过id找到对应的那一个数据，修改 对应数据 的title
export const updateSubjectList = (id, title) => {
  return (dispatch) => {//reqSubject请求函数
    return reqUpdateSubject(id, title).then((response) => {
      dispatch(updateSubjectListSync({ id, title }));
      return response.total;
    });
  };
};

