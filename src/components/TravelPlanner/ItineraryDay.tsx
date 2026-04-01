import React from 'react';
import { Card, Button, Typography, Space, Empty } from 'antd';
import { DeleteOutlined, MenuOutlined } from '@ant-design/icons';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import type { DiemDen } from '@/models/diemden/diemden';

const { Text } = Typography;

interface ItineraryDayProps {
    dayIndex: number;
    diemDens: DiemDen[];
    onRemoveDiemDen: (dayIndex: number, itemIndex: number) => void; 
}

const ItineraryDay: React.FC<ItineraryDayProps> = ({ dayIndex, diemDens, onRemoveDiemDen }) => {
    return (
        <Card title={`Ngày ${dayIndex + 1}`} style={{ marginBottom: 16 }} size="small">
            <Droppable droppableId={`day-${dayIndex}`}>
                {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                            minHeight: '50px',
                            background: snapshot.isDraggingOver ? '#fafafa' : 'transparent',
                            borderRadius: '4px'
                        }}
                    >
                        {diemDens.length === 0 && (
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Trống" />
                        )}
                        
                        {diemDens.map((item, index) => (
                            <Draggable
                                key={`${item.id}-${dayIndex}-${index}`}
                                draggableId={`itinerary-${item.id}-${dayIndex}-${index}`}
                                index={index}
                            >
                                {(providedDrag, snapshotDrag) => (
                                    <div
                                        ref={providedDrag.innerRef}
                                        {...providedDrag.draggableProps}
                                        style={{
                                            ...providedDrag.draggableProps.style,
                                            marginBottom: '4px',
                                            background: snapshotDrag.isDragging ? '#e6f7ff' : '#fff',
                                            padding: '10px',
                                            border: '1px solid #f0f0f0',
                                            borderRadius: '4px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            zIndex: snapshotDrag.isDragging ? 1000 : 1
                                        }}
                                    >
                                        <Space>
                                            <div {...providedDrag.dragHandleProps}>
                                                <MenuOutlined style={{ color: '#ccc', cursor: 'grab' }} />
                                            </div>
                                            <Typography.Text strong>{item.ten}</Typography.Text>
                                        </Space>
                                        
                                        <Space>
                                            <Typography.Text type="danger">
                                                {item.giaCa?.toLocaleString()}đ
                                            </Typography.Text>
                                            <Button 
                                                type="text" 
                                                danger 
                                                size="small"
                                                icon={<DeleteOutlined />} 
                                                onClick={() => onRemoveDiemDen(dayIndex, index)} 
                                            />
                                        </Space>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </Card>
    );
};

export default ItineraryDay;