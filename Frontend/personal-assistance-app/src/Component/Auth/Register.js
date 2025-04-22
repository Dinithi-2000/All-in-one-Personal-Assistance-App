import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import "./auth.css"
const Register = () => {
  const { register } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await register(values);
      message.success('Registration successful!');
      form.resetFields();
    } catch (error) {
      console.error('Registration error:', error);

      if (error.response) {
        const { data } = error.response;

        // Handle field-specific errors
        if (data.field) {
          form.setFields([{
            name: data.field,
            errors: [data.message]
          }]);

          // Scroll to error field
          const element = document.querySelector(`[name="${data.field}"]`);
          if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        message.error(data.message || 'Registration failed');
      } else {
        message.error('Network error: Please check your connection');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">

      <div className="auth-container">
        <div className="auth-glass-card">
          <h2>Register</h2>
          <Form form={form} name="register" className='auth-glass-car' onFinish={onFinish}>
            <Form.Item
              name="name"
              rules={[
                { required: true, message: 'Please input your name!' },
                { min: 2, message: 'Name must be at least 2 characters!' }
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Name" />
            </Form.Item>
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
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Register
              </Button>
            </Form.Item>
          </Form>
          <div className="auth-links">
            Already have an account? <Link to="/login">Login now</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;