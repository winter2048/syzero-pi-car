import { request } from "../utils/request";
import store from "../store";

export function Login(name: string, pwd: string) {
  return request.post<string>(
    `${store.getState().config.SERVER_URL_LOGIN}/api/SyZero.Authorization/Auth/Login`,
    {
      userName: name,
      passWord: pwd,
      type: 0,
    }
  );
}

export function LogOut() {
  return request.post<boolean>(
    `${store.getState().config.SERVER_URL_LOGIN}/api/SyZero.Authorization/Auth/LogOut`
  );
}

export function GetUserInfo() {
  return request.get<UserDto>(
    `${store.getState().config.SERVER_URL_LOGIN}/api/SyZero.Authorization/User/UserInfo`
  );
}

export function PutUserInfo(user: UserDto) {
  return request.put<UserDto>(
    `${store.getState().config.SERVER_URL_LOGIN}/api/SyZero.Authorization/User/UserInfo`,
    user
  );
}
