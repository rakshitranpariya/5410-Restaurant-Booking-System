import { UserOutlined, LogoutOutlined } from '@ant-design/icons';

const initialState = {
  isCollapsed: false,
  activatedSidebarKey: {
    key: window.location.pathname,
  },
  sidebarData: [
    {
      key: '/restaurants',
      label: 'Restaurants',
      icon: <UserOutlined />,
      url: '/restaurants',
      type: '1',
    },
    {
      key: '/logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      url: '/login',
      type: 'all',
    },
  ],
};

const SidebarReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'COLLAPSE':
      return {
        ...state,
        isCollapsed: !state.isCollapsed,
      };
    case 'CHANGE_SIDEBAR':
      return {
        ...state,
        activatedSidebarKey: payload,
      };
    default:
      return state;
  }
};

export default SidebarReducer;
