import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="auth">
      <div className="auth-glass-card">

        {user ? (
          <Result
            status="success"
            title={`Welcome back, ${user.name}!`}
            subTitle="You are successfully logged in."
            extra={[
              <Link to="/profile" key="profile">
                <Button type="primary">Go to Profile</Button>
              </Link>,
            ]}
          />
        ) : (
          <Result
            title="Welcome to Seranilux"
            subTitle="Please login or register to continue"
            extra={[
              <Link to="/login" key="login">
                <Button type="primary">Login</Button>
              </Link>,
              <Link to="/register" key="register">
                <Button>Register</Button>
              </Link>,
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default Home;