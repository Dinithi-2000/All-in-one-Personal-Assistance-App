import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Layout, Menu, Avatar, Descriptions, Button, Card, message, Typography, Divider, Row, Col } from 'antd';
import { UserOutlined, LogoutOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import BioDataForm from './BioDataForm';

const { Title, Text } = Typography;
const { Sider, Content } = Layout;

const ProfilePage = () => {
  const { user, bioData, logout, deleteBioData } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [localBioData, setLocalBioData] = useState(bioData);

  useEffect(() => {
    setLocalBioData(bioData);
  }, [bioData]);

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await deleteBioData();
      setLocalBioData(null);
      message.success('Personal information deleted successfully');
    } catch (error) {
      message.error('Failed to delete personal information');
    } finally {
      setDeleteLoading(false);
    }
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
            icon={<UserOutlined />}
            style={{ marginBottom: 16, backgroundColor: '#1890ff' }}
          />
          <Title level={4} style={{ marginBottom: 0 }}>
            {localBioData ? `${localBioData.firstName} ${localBioData.lastName}` : user?.name || 'User'}
          </Title>
          <Text type="secondary">{localBioData?.email || user?.email}</Text>
        </div>
        <Divider style={{ margin: 0 }} />
        <Menu
          mode="inline"
          selectedKeys={[activeTab]}
          style={{ borderRight: 0, padding: '8px 0' }}
          onSelect={({ key }) => setActiveTab(key)}
        >
          <Menu.Item key="profile" icon={<UserOutlined />}>
            Profile Information
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
        <Card
          title="Personal Information"
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
                <Descriptions.Item label="First Name">
                  <Text>{localBioData.firstName}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Last Name">
                  <Text>{localBioData.lastName}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  <Text>{localBioData.email}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Phone Number">
                  <Text>{localBioData.phoneNumber}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="NIC Number">
                  <Text>{localBioData.nic}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Address">
                  <Text>
                    {`${localBioData.address.street}, ${localBioData.address.city}, 
                    ${localBioData.address.state} ${localBioData.address.postalCode}, 
                    ${localBioData.address.country}`}
                  </Text>
                </Descriptions.Item>
              </Descriptions>
              <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                <BioDataForm />
                <Button 
                  danger
                  onClick={handleDelete}
                  icon={<DeleteOutlined />}
                  loading={deleteLoading}
                >
                  Delete Information
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
              <UserOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
              <Title level={4} style={{ marginBottom: 8 }}>No Personal Information Found</Title>
              <Text type="secondary" style={{ marginBottom: 24, display: 'block' }}>
                You haven't added your personal information yet. Please click below to get started.
              </Text>
              <BioDataForm />
            </div>
          )}
        </Card>

        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={12}>
            <Card title="Account Information" style={{ borderRadius: 8, boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' }}>
              <Descriptions column={1}>
                <Descriptions.Item label="Username">
                  <Text strong>{user?.username}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Account Created">
                  <Text>
                    {new Date(user?.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Actions" style={{ borderRadius: 8, boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' }}>
              <Button 
                type="primary" 
                icon={<EditOutlined />} 
                block
                style={{ marginBottom: 8 }}
                onClick={() => document.querySelector('.ant-btn-primary').click()} // Trigger the BioDataForm button
              >
                {localBioData ? 'Update Information' : 'Add Information'}
              </Button>
              <Button 
                danger
                icon={<DeleteOutlined />}
                block
                onClick={handleDelete}
                disabled={!localBioData}
                loading={deleteLoading}
              >
                Delete Information
              </Button>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default ProfilePage;