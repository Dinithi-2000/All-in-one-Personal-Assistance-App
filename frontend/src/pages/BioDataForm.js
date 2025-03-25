import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Modal, message } from 'antd';
import { useAuth } from '../context/AuthContext';

const { Option } = Select;
const { TextArea } = Input;

const BioDataForm = () => {
  const [form] = Form.useForm();
  const { bioData, saveBioData, loading } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (bioData && visible) {
      form.setFieldsValue({
        age: bioData.age,
        gender: bioData.gender,
        height: bioData.height,
        weight: bioData.weight,
        bloodType: bioData.bloodType,
        allergies: bioData.allergies || '',
        medicalConditions: bioData.medicalConditions || ''
      });
    }
  }, [bioData, form, visible]);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values) => {
    try {
      await saveBioData(values);
      message.success('Biomedical data saved successfully');
      handleCancel();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <>
      <Button 
        type="primary" 
        onClick={showModal}
        style={{ marginBottom: 16 }}
      >
        {bioData ? 'Update Biomedical Data' : 'Add Biomedical Data'}
      </Button>

      <Modal
        title={bioData ? "Update Biomedical Data" : "Add Biomedical Data"}
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            gender: 'male',
            bloodType: 'A+'
          }}
        >
          <Form.Item
            name="age"
            label="Age"
            rules={[{ 
              required: true, 
              message: 'Please input your age',
              type: 'number',
              min: 1,
              max: 120
            }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: 'Please select your gender' }]}
          >
            <Select>
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="height"
            label="Height (cm)"
            rules={[{ 
              required: true, 
              message: 'Please input your height',
              pattern: new RegExp(/^[0-9]+$/),
              message: 'Please enter a valid number'
            }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="weight"
            label="Weight (kg)"
            rules={[{ 
              required: true, 
              message: 'Please input your weight',
              pattern: new RegExp(/^[0-9]+$/),
              message: 'Please enter a valid number'
            }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="bloodType"
            label="Blood Type"
            rules={[{ required: true, message: 'Please select your blood type' }]}
          >
            <Select>
              <Option value="A+">A+</Option>
              <Option value="A-">A-</Option>
              <Option value="B+">B+</Option>
              <Option value="B-">B-</Option>
              <Option value="AB+">AB+</Option>
              <Option value="AB-">AB-</Option>
              <Option value="O+">O+</Option>
              <Option value="O-">O-</Option>
            </Select>
          </Form.Item>

          <Form.Item name="allergies" label="Allergies (if any)">
            <TextArea rows={2} placeholder="List any allergies you have" />
          </Form.Item>

          <Form.Item name="medicalConditions" label="Medical Conditions (if any)">
            <TextArea rows={2} placeholder="List any medical conditions you have" />
          </Form.Item>

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