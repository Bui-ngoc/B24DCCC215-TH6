import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Row, Col, Spin, Empty, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import DestinationCard from '@/components/TravelPlanner/DestinationCard';
import DestinationFilter, { FilterValues } from '@/components/TravelPlanner/DestinationFilter';
import type { DiemDen } from '@/models/diemden/diemden';
import { getDanhSachDiemDen } from '@/services/diemden/diemdenService';
import { history } from 'umi';

const DiemDenPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [diemDens, setDiemDens] = useState<DiemDen[]>([]);
    const [filteredDiemDens, setFilteredDiemDens] = useState<DiemDen[]>([]);

    const fetchDiemDens = async () => {
        setLoading(true);
        try {
            const data = await getDanhSachDiemDen();
            setDiemDens(data);
            setFilteredDiemDens(data);
        } catch (error) {
            message.error('Lỗi khi tải danh sách điểm đến');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDiemDens();
    }, []);

    const handleFilterChange = (values: FilterValues) => {
        let result = [...diemDens];

        if (values.loaiHinh) {
            result = result.filter(d => d.loaiHinh === values.loaiHinh);
        }

        if (values.sortBy) {
            switch (values.sortBy) {
                case 'giaCaAsc':
                    result.sort((a, b) => a.giaCa - b.giaCa);
                    break;
                case 'giaCaDesc':
                    result.sort((a, b) => b.giaCa - a.giaCa);
                    break;
                case 'danhGiaDesc':
                    result.sort((a, b) => b.danhGia - a.danhGia);
                    break;
            }
        }

        setFilteredDiemDens(result);
    };

    const handleAddToItinerary = (diemDen: DiemDen) => {
  const savedData = localStorage.getItem('my_itinerary_data');
  
  let currentLichTrinh = savedData 
    ? JSON.parse(savedData) 
    : { 
        id: '1', 
        tenLichTrinh: 'Chuyến đi của Ngoc', 
        chiTiet: [{ ngay: 1, diemDens: [] }], 
        tongNganSach: 0 
      };

 
  currentLichTrinh.chiTiet[0].diemDens.push({ ...diemDen });

  currentLichTrinh.tongNganSach = currentLichTrinh.chiTiet.reduce((total: number, day: any) => 
    total + day.diemDens.reduce((sum: number, item: any) => sum + (item.giaCa || 0), 0), 0
  );

  localStorage.setItem('my_itinerary_data', JSON.stringify(currentLichTrinh));
  
  message.success(`Đã thêm ${diemDen.ten} vào lịch trình thành công!`);
  
};
const handleRemoveDiemDen = (dayIndex: number, diemDenId: string, itemIndex: number) => {
    if (!lichTrinh) return;
    const newChiTiet = [...lichTrinh.chiTiet];
    
    newChiTiet[dayIndex].diemDens.splice(itemIndex, 1);
    
    const total = calculateTotal(newChiTiet);
    setLichTrinh({
        ...lichTrinh,
        chiTiet: newChiTiet,
        tongNganSach: total
    });
    message.info('Đã xóa điểm đến khỏi lịch trình');
};


    return (
        <PageContainer title="Khám phá điểm đến" subTitle="Tìm kiếm những địa điểm tuyệt vời cho chuyến đi của bạn">
            <DestinationFilter onFilterChange={handleFilterChange} />
            
            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                    <Spin size="large" />
                </div>
            ) : filteredDiemDens.length > 0 ? (
                <Row gutter={[16, 16]}>
                    {filteredDiemDens.map(diemDen => (
                        <Col xs={24} sm={12} md={8} lg={6} xl={6} key={diemDen.id}>
                            <DestinationCard 
                                diemDen={diemDen} 
                                extraAction={
                                    <Button 
                                        type="link" 
                                        icon={<PlusOutlined />} 
                                        onClick={() => handleAddToItinerary(diemDen)}
                                    >
                                        Lên lịch trình
                                    </Button>
                                }
                            />
                        </Col>
                    ))}
                </Row>
            ) : (
                <Empty description="Không tìm thấy điểm đến nào phù hợp" />
            )}
        </PageContainer>
    );
};

export default DiemDenPage;
