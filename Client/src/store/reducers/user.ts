import { IActionType } from "../../utils/constant";

const initUserState: IUser = {
  id: 0,
  name: "",
};

const user = (
  state: IUser = initUserState,
  action: { type: IActionType; payload: any }
):IUser => {
  switch (action.type) {
    case IActionType.UserInit:
      return state;
    case IActionType.UserChange:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
export default user;
