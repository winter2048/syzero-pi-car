import { IActionType } from "../../utils/constant";

const initConfig: IConfig = {
    SERVER_URL: ""
};

const config = (
  state: IConfig = initConfig,
  action: { type: IActionType; payload: any }
): IConfig => {
  switch (action.type) {
    case IActionType.ConfigInit:
      return state;
    case IActionType.ConfigChange:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
export default config;
