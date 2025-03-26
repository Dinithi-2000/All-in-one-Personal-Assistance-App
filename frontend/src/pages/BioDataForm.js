import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Modal, message, Row, Col, Divider } from 'antd';
import { useAuth } from '../context/AuthContext';

const BioDataForm = () => {
  const [form] = Form.useForm();
  const { bioData, saveBioData, loading } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (bioData && visible) {
      form.setFieldsValue({
        firstName: bioData.firstName,
        lastName: bioData.lastName,
        email: bioData.email,
        phoneNumber: bioData.phoneNumber,
        nic: bioData.nic,
        address: bioData.address || {
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: ''
        },
        age: bioData.age,
        gender: bioData.gender,
        bloodType: bioData.bloodType
      });
    }
  }, [bioData, form, visible]);

  const showModal = () => {
    setVisible(true);
    form.resetFields();
  };

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values) => {
    try {
      await saveBioData(values);
      message.success('Personal information saved successfully');
      handleCancel();
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Handle field-specific errors from backend
      if (error.response?.data?.field) {
        const { field, message: errorMessage } = error.response.data;
        
        // Handle nested fields (like address fields)
        const fieldName = field.includes('.') ? field.split('.') : field;
        
        form.setFields([{
          name: fieldName,
          errors: [errorMessage]
        }]);
        
        // Scroll to the error field
        const element = document.querySelector(`[name="${field}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } 
      // Handle other error formats
      else if (error.message) {
        message.error(error.message);
      } else {
        message.error('Failed to save data. Please try again.');
      }
    }
  };
  
  return (
    <>
      <Button 
        type="primary" 
        onClick={showModal}
        style={{ marginBottom: 16 }}
      >
        {bioData ? 'Update Information' : 'Add Personal Information'}
      </Button>

      <Modal
        title={bioData ? "Update Personal Information" : "Add Personal Information"}
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          {/* Name Fields */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[{ required: true, message: 'Please input your first name' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: 'Please input your last name' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          {/* Contact Fields */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please input your email' },
                  { type: 'email', message: 'Please enter a valid email address' }
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phoneNumber"
                label="Phone Number"
                rules={[
                  { required: true, message: 'Please input your phone number' },
                  { pattern: /^[0-9]{10,15}$/, message: 'Please enter 10-15 digit phone number' }
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          {/* NIC Field - This will show the duplicate NIC error */}
          <Form.Item
            name="nic"
            label="NIC Number"
            rules={[
              { required: true, message: 'Please input your NIC number' },
              { 
                pattern: /^([0-9]{9}[vVxX]|[0-9]{12})$/,
                message: 'Please enter valid NIC (9 digits + V/X or 12 digits)'
              }
            ]}
          >
            <Input placeholder="e.g., 200034001V or 200034001816" />
          </Form.Item>

          <Divider orientation="left">Address Information</Divider>

          {/* Address Fields */}
          <Form.Item
            name={['address', 'street']}
            label="Street Address"
            rules={[{ required: true, message: 'Please input street address' }]}
          >
            <Input placeholder="Street address" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={['address', 'city']}
                label="City"
                rules={[{ required: true, message: 'Please input city' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={['address', 'state']}
                label="State/Province"
                rules={[{ required: true, message: 'Please input state/province' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={['address', 'postalCode']}
                label="Postal Code"
                rules={[{ required: true, message: 'Please input postal code' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={['address', 'country']}
                label="Country"
                rules={[{ required: true, message: 'Please input country' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ width: '100%' }}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default BioDataForm;