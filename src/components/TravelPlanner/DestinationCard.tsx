import React from 'react';
import { Card, Typography, Rate, Tag, Space } from 'antd';
import { EnvironmentOutlined, DollarOutlined } from '@ant-design/icons';
import type { DiemDen } from '@/models/diemden/diemden';

const { Title, Text, Paragraph } = Typography;

interface DestinationCardProps {
    diemDen: DiemDen;
    extraAction?: React.ReactNode;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ diemDen, extraAction }) => {
    return (
        <Card
            hoverable
            cover={<img alt={diemDen.ten} src={diemDen.hinhAnh} style={{ height: 200, objectFit: 'cover' }} />}
            actions={extraAction ? [extraAction] : undefined}
            bodyStyle={{ padding: '16px' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <Title level={4} style={{ margin: 0 }} ellipsis={{ tooltip: diemDen.ten }}>
                    {diemDen.ten}
                </Title>
                <Tag color={diemDen.loaiHinh === 'Bien' ? 'blue' : diemDen.loaiHinh === 'Nui' ? 'green' : 'orange'}>
                    {diemDen.loaiHinh === 'Bien' ? 'Biển' : diemDen.loaiHinh === 'Nui' ? 'Núi' : 'Thành Phố'}
                </Tag>
            </div>
            
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Text type="secondary">
                    <EnvironmentOutlined /> {diemDen.diaDiem}
                </Text>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Rate disabled defaultValue={diemDen.danhGia} allowHalf style={{ fontSize: 14 }} />
                    <Text type="secondary">({diemDen.danhGia})</Text>
                </div>

                <Paragraph ellipsis={{ rows: 2 }} style={{ margin: 0, minHeight: 44 }}>
                    {diemDen.moTa}
                </Paragraph>

                <div style={{ marginTop: 8 }}>
                    <Text strong style={{ fontSize: 18, color: '#fa8c16' }}>
                        <DollarOutlined /> {diemDen.giaCa.toLocaleString('vi-VN')} đ
                    </Text>
                </div>
            </Space>
        </Card>
    );
};

export default DestinationCard;
