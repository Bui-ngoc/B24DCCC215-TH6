import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Row, Col, Card, Typography, Spin, Button, message, Statistic, Divider, Empty } from 'antd';
import { PlusOutlined, SaveOutlined, CalculatorOutlined } from '@ant-design/icons';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import ItineraryDay from '@/components/TravelPlanner/ItineraryDay';
import { getLichTrinh, saveLichTrinh } from '@/services/lichtrinh/lichtrinhService';
import type { LichTrinh } from '@/models/lichtrinh/lichtrinh';

const { Title } = Typography;

const LichTrinhPage: React.FC = () => {
    const [lichTrinh, setLichTrinh] = useState<LichTrinh | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = () => {
            setLoading(true);
            const dataStr = localStorage.getItem('my_itinerary_data');
            if (dataStr) {
                setLichTrinh(JSON.parse(dataStr));
            } else {
                setLichTrinh(null);
            }
            setLoading(false);
        };
        loadData();
    }, []);

    const calculateTotal = (chiTiet: any[]) => {
        return chiTiet.reduce((sum, day) =>
            sum + day.diemDens.reduce((daySum: number, item: any) => daySum + (item.giaCa || 0), 0), 0
        );
    };

    const onDragEnd = (result: DropResult) => {
        if (!lichTrinh || !result.destination) return;
        const { source, destination } = result;

        const newChiTiet = JSON.parse(JSON.stringify(lichTrinh.chiTiet));

        const sourceDayIndex = parseInt(source.droppableId.replace('day-', ''), 10);
        const destDayIndex = parseInt(destination.droppableId.replace('day-', ''), 10);

        const [movedItem] = newChiTiet[sourceDayIndex].diemDens.splice(source.index, 1);
        newChiTiet[destDayIndex].diemDens.splice(destination.index, 0, movedItem);

        const total = calculateTotal(newChiTiet);
        const updatedLichTrinh = { ...lichTrinh, chiTiet: newChiTiet, tongNganSach: total };

        setLichTrinh(updatedLichTrinh);
        localStorage.setItem('my_itinerary_data', JSON.stringify(updatedLichTrinh));
    };

    const handleRemove = (dayIndex: number, itemIndex: number) => {
        if (!lichTrinh) return;
        const newChiTiet = [...lichTrinh.chiTiet];
        newChiTiet[dayIndex].diemDens.splice(itemIndex, 1);

        const total = calculateTotal(newChiTiet);
        const updated = { ...lichTrinh, chiTiet: newChiTiet, tongNganSach: total };

        setLichTrinh(updated);
        localStorage.setItem('my_itinerary_data', JSON.stringify(updated));
        message.success('Đã xóa địa điểm');
    };

    const handleAddDay = () => {
        if (!lichTrinh) return;
        const newDay = { ngay: lichTrinh.chiTiet.length + 1, diemDens: [] };
        const updated = { ...lichTrinh, chiTiet: [...lichTrinh.chiTiet, newDay] };
        setLichTrinh(updated);
        localStorage.setItem('my_itinerary_data', JSON.stringify(updated));
    };

    const handleSave = async () => {
        if (lichTrinh) {
            await saveLichTrinh(lichTrinh);
            message.success('Đã lưu lịch trình vào hệ thống!');
        }
    };

    if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

    const hasData = lichTrinh && lichTrinh.chiTiet.some(day => day.diemDens.length > 0);

    return (
        <PageContainer
            title="Lập kế hoạch chuyến đi"
            extra={[
                <Button key="save" type="primary" icon={<SaveOutlined />} onClick={handleSave}>Lưu lịch trình</Button>
            ]}
        >
            {!hasData ? (
                <Card>
                    <Empty
                        description="Bạn chưa có điểm đến nào. Hãy quay lại trang Khám Phá để thêm địa điểm!"
                        style={{ padding: '40px 0' }}
                    >
                        <Button type="primary" onClick={() => window.location.href = '/diemden'}>Đến trang Khám Phá</Button>
                    </Empty>
                </Card>
            ) : (
                <DragDropContext onDragEnd={onDragEnd}>
                    <Row gutter={24}>
                        <Col xs={24} lg={16}>
                            {lichTrinh.chiTiet.map((day, index) => (
                                <ItineraryDay
                                    key={`day-${index}`}
                                    dayIndex={index}
                                    diemDens={day.diemDens}
                                    onRemoveDiemDen={handleRemove}
                                />
                            ))}
                            <Button type="dashed" block icon={<PlusOutlined />} onClick={handleAddDay} style={{ marginTop: 8 }}>
                                Thêm Ngày Mới
                            </Button>
                        </Col>

                        <Col xs={24} lg={8}>
                            <Card title={<span><CalculatorOutlined /> Dự toán chi phí</span>} sticky>
                                <Statistic
                                    title="Tổng chi phí dự kiến"
                                    value={lichTrinh.tongNganSach}
                                    suffix="VNĐ"
                                    valueStyle={{ color: '#cf1322' }}
                                />
                                <Divider orientation="left" plain>Chi tiết dịch vụ</Divider>
                                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                    {lichTrinh.chiTiet.map((day, idx) => (
                                        day.diemDens.length > 0 && (
                                            <div key={idx} style={{ marginBottom: 12 }}>
                                                <Typography.Text strong>Ngày {idx + 1}:</Typography.Text>
                                                {day.diemDens.map((item, i) => (
                                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: 10 }}>
                                                        <Typography.Text type="secondary" style={{ fontSize: '12px' }}>- {item.ten}</Typography.Text>
                                                        <Typography.Text style={{ fontSize: '12px' }}>{item.giaCa.toLocaleString()}đ</Typography.Text>
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    ))}
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </DragDropContext>
            )}
        </PageContainer>
    );
};

export default LichTrinhPage;