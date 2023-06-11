import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { HashRouter } from "react-router-dom";
import {
  FluentProvider,
  BrandVariants,
  Theme,
  createLightTheme,
  createDarkTheme,
} from "@fluentui/react-components";
import Routes from "./routers";
import { Provider } from "react-redux";
import store from "./store";
import axios from "axios";
import { useDispatch } from "react-redux";
import { IActionType } from "./utils/constant";
import "./style/index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const myNewTheme: BrandVariants = {
  10: "#020203",
  20: "#161618",
  30: "#232427",
  40: "#2F3033",
  50: "#3B3C3F",
  60: "#47484B",
  70: "#545558",
  80: "#626265",
  90: "#6F7072",
  100: "#7D7E80",
  110: "#8B8C8E",
  120: "#9A9A9C",
  130: "#A8A9AA",
  140: "#B7B8B9",
  150: "#C6C7C8",
  160: "#D6D6D7",
};

const lightTheme: Theme = {
  ...createLightTheme(myNewTheme),
};

const darkTheme: Theme = {
  ...createDarkTheme(myNewTheme),
};

darkTheme.colorBrandForeground1 = myNewTheme[110];
darkTheme.colorBrandForeground2 = myNewTheme[120];

const RootElement = (props: { children: JSX.Element; env: any }) => {
  const dispatch = useDispatch();
  dispatch({
    type: IActionType.ConfigChange,
    payload: { ...props.env },
  });
  return <div>{props.children}</div>;
};

axios.get("/config.json").then((res) => {
  const env = res.data[res.data.UI_ENVIRONMENT];
  root.render(
    <Provider store={store}>
      <RootElement env={env}>
        <HashRouter>
          <FluentProvider theme={lightTheme}>
            <Routes />
          </FluentProvider>
        </HashRouter>
      </RootElement>
    </Provider>
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
