import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, Dropdown, Avatar, Button, message } from 'antd';
import {
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  FormOutlined,
  KeyOutlined,
} from '@ant-design/icons';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  const handleLogout = () => {
    logout();
    message.success('Logged out successfully');
    navigate('/login');
  };

  const menu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link to="/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          Fitness Pro
        </Link>
      </div>
      <div className="navbar-right">
        {user ? (
          <Dropdown overlay={menu} trigger={['click']}>
            <Avatar
              src={user.avatar}
              icon={<UserOutlined />}
              style={{ cursor: 'pointer' }}
            />
          </Dropdown>
        ) : (
          <>
            <Link to="/login">
              <Button type="text" icon={<LoginOutlined />}>
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button type="primary" icon={<FormOutlined />}>
                Register
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;