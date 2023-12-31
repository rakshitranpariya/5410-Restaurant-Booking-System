import React, { useState, useEffect } from 'react';
import { Layout, Menu, Divider, Tooltip } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { handleSidebarChange } from '../redux/actions/sidebarAction';
import { logout } from '../redux/actions/authActions';
import LOGO from '../assets/light-logo.svg';
import './sidebar.css';

const { Sider } = Layout;
const { Item } = Menu;

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isCollapsed, activatedSidebarKey, sidebarData } = useSelector(state => state.sidebar);
  const { user } = useSelector(state => state.auth);
  const [updatedSidebar, setUpdatedSidebar] = useState([]);

  useEffect(() => {
    console.log(sidebarData, user);
    const temp = sidebarData.filter(
      cur => cur.type === 'all' || cur.type === user?.type?.toString()
    );
    console.log(temp);
    setUpdatedSidebar(temp);
  }, [sidebarData]);

  const changeSidebar = async e => {
    try {
      console.log(e.key);
      if (e.key === '/logout') {
        await dispatch(logout());
        console.log(user);
        user?.type === '3' ? navigate('/adminLogin') : navigate(`${e.url}`);
      } else {
        await dispatch(handleSidebarChange(e));
        navigate(`${e.url}`);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Sider trigger={null} collapsible collapsed={isCollapsed}>
      <div className="demo-logo-vertical" />
      <Menu theme="dark" mode="inline" selectedKeys={[activatedSidebarKey.key]}>
        <Item
          key="/restaurants"
          onClick={e => changeSidebar(e)}
          className="menu-item-wrapper markethub-item"
        >
          {isCollapsed ? (
            <span className="menu-item-text">
              <img src={LOGO} alt="Logo" className="logo-image" />
            </span>
          ) : (
            <div className="menu-item-text">
              <img src={LOGO} alt="Logo" className="logo-image" />
              Reservation
            </div>
          )}
        </Item>

        <Divider className="sidebar-divider" />
        {updatedSidebar.length > 0 &&
          updatedSidebar.map(e => (
            <Item key={e.key} onClick={() => changeSidebar(e)} className="menu-item-wrapper">
              {isCollapsed ? (
                <Tooltip
                  placement="right"
                  title={<span className="menu-item-text">{e.label}</span>}
                >
                  <span className="menu-item-text">{e.icon}</span>
                </Tooltip>
              ) : (
                <span className="menu-item-text">
                  {e.icon} {e.label}
                </span>
              )}
            </Item>
          ))}
      </Menu>
    </Sider>
  );
};

export default Sidebar;
