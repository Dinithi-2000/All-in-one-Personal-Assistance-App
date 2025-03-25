import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Layout, Menu, Avatar, Descriptions, Button, Card, message, Row, Col, Typography, Divider, Modal, Form, Input, Select } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  MedicineBoxOutlined,
  ProfileOutlined,
  EditOutlined,
  DeleteOutlined,
  SolutionOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Sider, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;

const ProfilePage = () => {
  const { user, bioData, logout, deleteBioData, saveBioData } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [localBioData, setLocalBioData] = useState(bioData);

  // Sync localBioData with context bioData
  useEffect(() => {
    setLocalBioData(bioData);
  }, [bioData]);

  // Initialize form with current values when modal opens
  useEffect(() => {
    if (formVisible) {
      form.resetFields();
      if (localBioData) {
        form.setFieldsValue({
          age: localBioData.age,
          gender: localBioData.gender,
          height: localBioData.height,
          weight: localBioData.weight,
          bloodType: localBioData.bloodType,
          allergies: localBioData.allergies || '',
          medicalConditions: localBioData.medicalConditions || ''
        });
      } else {
        form.setFieldsValue({
          gender: 'male',
          bloodType: 'A+'
        });
      }
    }
  }, [formVisible, localBioData, form]);

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await deleteBioData();
      setLocalBioData(null);
      message.success('Biomedical data deleted successfully');
    } catch (error) {
      message.error('Failed to delete biomedical data');
    } finally {
      setDeleteLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      // Convert numeric fields to numbers explicitly
      const numericValues = {
        ...values,
        age: Number(values.age),
        height: Number(values.height),
        weight: Number(values.weight)
      };
      
      const updatedData = await saveBioData(numericValues);
      setLocalBioData(updatedData);
      message.success('Biomedical data saved successfully');
      setFormVisible(false);
    } catch (error) {
      message.error('Failed to save biomedical data');
    } finally {
      setLoading(false);
    }
  };

  const handleFormCancel = () => {
    form.resetFields();
    setFormVisible(false);
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Sider 
        width={250} 
        theme="light"
        style={{
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          background: '#fff'
        }}
      >
        <div style={{ padding: '24px 16px', textAlign: 'center' }}>
          <Avatar 
            size={80} 
            src={user?.avatar} 
            icon={<UserOutlined />}
            style={{ marginBottom: 16 }}
          />
          <Title level={4} style={{ marginBottom: 0 }}>{user?.name}</Title>
          <Text type="secondary">{user?.email}</Text>
        </div>
        <Divider style={{ margin: 0 }} />
        <Menu
          mode="inline"
          selectedKeys={[activeTab]}
          style={{ borderRight: 0, padding: '8px 0' }}
          onSelect={({ key }) => setActiveTab(key)}
        >
          <Menu.Item key="profile" icon={<ProfileOutlined />}>
            Profile Information
          </Menu.Item>
          <Menu.Item key="bio" icon={<MedicineBoxOutlined />}>
            Medical Records
          </Menu.Item>
          <Menu.Item 
            key="logout" 
            icon={<LogoutOutlined />}
            onClick={logout}
            danger
          >
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      
      <Content style={{ padding: '24px' }}>
        {activeTab === 'profile' && (
          <Card
            title="Profile Information"
            bordered={false}
            style={{ borderRadius: 8, boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' }}
          >
            <Row gutter={[24, 16]}>
              <Col span={24}>
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="Full Name">
                    <Text strong>{user?.name}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Email Address">
                    <Text>{user?.email}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Member Since">
                    <Text>{new Date(user?.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</Text>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={24}>
                {/* <Button 
                  type="primary" 
                  icon={<EditOutlined />}
                  onClick={() => message.info('Profile edit functionality coming soon!')}
                >
                  Edit Profile
                </Button> */}
              </Col>
            </Row>
          </Card>
        )}

        {activeTab === 'bio' && (
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <SolutionOutlined style={{ marginRight: 8, fontSize: 18 }} />
                <span>Medical Records</span>
              </div>
            }
            bordered={false}
            style={{ borderRadius: 8, boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' }}
          >
            {localBioData ? (
              <>
                <Descriptions 
                  bordered 
                  column={1}
                  labelStyle={{ 
                    width: '200px',
                    background: '#fafafa',
                    fontWeight: 500 
                  }}
                >
                  <Descriptions.Item label="Age">
                    <Text>{localBioData.age} {localBioData.age === 1 ? 'year' : 'years'}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Gender">
                    <Text>{localBioData.gender.charAt(0).toUpperCase() + localBioData.gender.slice(1)}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Height">
                    <Text>{localBioData.height} cm</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Weight">
                    <Text>{localBioData.weight} kg</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Blood Type">
                    <Text>{localBioData.bloodType}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Allergies">
                    <Text>{localBioData.allergies || 'None reported'}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Medical Conditions">
                    <Text>{localBioData.medicalConditions || 'None reported'}</Text>
                  </Descriptions.Item>
                </Descriptions>
                <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                  <Button 
                    type="primary" 
                    onClick={() => setFormVisible(true)}
                    icon={<EditOutlined />}
                  >
                    Update Records
                  </Button>
                  <Button 
                    danger
                    onClick={handleDelete}
                    icon={<DeleteOutlined />}
                    loading={deleteLoading}
                  >
                    Delete Records
                  </Button>
                </div>
              </>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 20px',
                background: '#fafafa',
                borderRadius: 8
              }}>
                <MedicineBoxOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
                <Title level={4} style={{ marginBottom: 8 }}>No Medical Records Found</Title>
                <Text type="secondary" style={{ marginBottom: 24, display: 'block' }}>
                  You haven't added your biomedical data yet. Please click below to get started.
                </Text>
                <Button 
                  type="primary" 
                  size="large"
                  onClick={() => setFormVisible(true)}
                  icon={<EditOutlined />}
                >
                  Add Medical Records
                </Button>
              </div>
            )}
          </Card>
        )}
      </Content>

      <Modal
        title={localBioData ? "Update Medical Records" : "Add Medical Records"}
        open={formVisible}
        onCancel={handleFormCancel}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="age"
            label="Age"
            rules={[
              { 
                required: true, 
                message: 'Please input your age' 
              },
              { 
                type: 'number',
                min: 1,
                max: 120,
                message: 'Age must be between 1 and 120',
                transform: value => Number(value)
              }
            ]}
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
            rules={[
              { 
                required: true, 
                message: 'Please input your height' 
              },
              { 
                type: 'number',
                min: 50,
                max: 300,
                message: 'Height must be between 50cm and 300cm',
                transform: value => Number(value)
              }
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="weight"
            label="Weight (kg)"
            rules={[
              { 
                required: true, 
                message: 'Please input your weight' 
              },
              { 
                type: 'number',
                min: 2,
                max: 500,
                message: 'Weight must be between 2kg and 500kg',
                transform: value => Number(value)
              }
            ]}
          >
            <Input type="number" />
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
    </Layout>
  );
};

export default ProfilePage;