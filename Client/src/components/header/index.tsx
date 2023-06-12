import {
  Tab,
  TabList,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  SelectTabData,
  SelectTabEvent,
} from "@fluentui/react-components";
import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Authorization } from "../../api";
import { useSelector } from 'react-redux';

export const Header = () => {
  const defaultMenu = "/control";
  const location = useLocation();
  const navigate = useNavigate();
  const [tab, setTab] = React.useState(location.pathname);
  const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    navigate(data.value as string);
    setTab(data.value as string);
  };

  React.useEffect(() => {
    if (location.pathname === "/") {
      navigate(defaultMenu);
      setTab(defaultMenu);
    }
  }, [location.pathname, navigate]);

  return (
    <div className="sy-header">
      <TabList
        defaultSelectedValue={defaultMenu}
        onTabSelect={onTabSelect}
        selectedValue={tab}
      >
        <Tab value="/control">阿克曼</Tab>
        <Tab value="/mecanum">麦克纳姆轮</Tab>
        <Tab value="/test">测试</Tab>
        <Tab value="/text">自动</Tab>
        <Tab value="/setting">设置</Tab>
      </TabList>

      <div style={{marginRight:'15px', lineHeight: '44px', fontSize: '18px', fontFamily: 'fantasy'}}>SyZero Pi Car</div>
    </div>
  );
};
export default Header;
