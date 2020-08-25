import request from "@utils/request";

const BASE_URL = "/oauth";
// digits 发送验证码POST
// http://localhost:5000/oauth/sign_in/digits

export function reqVerificationCode(mobile) {
  return request({
    url: `${BASE_URL}/sign_in/digits`,
    method: 'POST',
    data: {
      mobile
    }
  })
}