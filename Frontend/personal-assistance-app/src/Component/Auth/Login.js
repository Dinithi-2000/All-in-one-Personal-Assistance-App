import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import "./auth.css";

const Login = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm(); // Add form instance

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await login(values);
    } catch (error) {
      // Handle specific error cases
      const errorMessage = error.response?.data?.message || 'Login failed';
      
      if (errorMessage.toLowerCase().includes('email') || 
          errorMessage.toLowerCase().includes('user')) {
        form.setFields([
          {
            name: 'email',
            errors: [errorMessage],
          },
        ]);
      } else if (errorMessage.toLowerCase().includes('password') || 
                 errorMessage.toLowerCase().includes('credentials')) {
        form.setFields([
          {
            name: 'password',
            errors: [errorMessage],
          },
        ]);
      } else {
        message.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth-glass-card">
        <h2>Login</h2>
        <Form 
          form={form} // Connect the form instance
          name="login" 
          className='j' 
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Login
            </Button>
          </Form.Item>
        </Form>
        <div className="auth-links">
          <Link to="/forgot-password">Forgot password?</Link>
          <span> or </span>
          <Link to="/register">Register now</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;