import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Form, Input, Button, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const { resetToken } = await forgotPassword(values.email);
      message.success('Password reset link sent to your email!');
      navigate('/reset-password', { state: { resetToken } });
    } catch (err) {
      // Check for specific error message from backend
      if (err.response?.data?.message === "User not found with this email") {
        // Display error under the email field
        form.setFields([
          {
            name: 'email',
            errors: [err.response.data.message],
          },
        ]);
      } else {
        // Show generic error message
        message.error(err.response?.data?.message || 'Failed to send reset email');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Forgot Password</h2>
        <Form form={form} name="forgot-password" onFinish={onFinish}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Send Reset Link
            </Button>
          </Form.Item>
        </Form>
        <div className="auth-links">
          <Link to="/login">Back to login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;