import type { DiemDen } from '@/models/diemden/diemden';

const mockDiemDen: DiemDen[] = [
    {
        id: '1',
        ten: 'Vịnh Hạ Long',
        diaDiem: 'Quảng Ninh',
        hinhAnh: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80',
        moTa: 'Di sản thiên nhiên thế giới với hàng ngàn hòn đảo đá vôi đan xen.',
        loaiHinh: 'Bien',
        danhGia: 4.8,
        giaCa: 1500000,
    },
    {
        id: '2',
        ten: 'Fansipan',
        diaDiem: 'Lào Cai',
        hinhAnh: 'https://images.unsplash.com/photo-1542013871408-fb7f7229e61c?auto=format&fit=crop&q=80',
        moTa: 'Nóc nhà Đông Dương với khung cảnh hùng vĩ.',
        loaiHinh: 'Nui',
        danhGia: 4.9,
        giaCa: 1200000,
    },
    {
        id: '3',
        ten: 'Phố Cổ Hội An',
        diaDiem: 'Quảng Nam',
        hinhAnh: 'https://images.unsplash.com/photo-1497217968520-7d8d60b7eb25?auto=format&fit=crop&q=80',
        moTa: 'Phố cổ Hội An với đèn lồng lung linh và kiến trúc cổ kính.',
        loaiHinh: 'ThanhPho',
        danhGia: 4.7,
        giaCa: 800000,
    },
    {
        id: '4',
        ten: 'Thành phố Đà Lạt',
        diaDiem: 'Lâm Đồng',
        hinhAnh: 'https://images.unsplash.com/photo-1620950392949-0145ed029ad1?auto=format&fit=crop&q=80',
        moTa: 'Thành phố ngàn hoa với khí hậu mát mẻ quanh năm.',
        loaiHinh: 'Nui',
        danhGia: 4.6,
        giaCa: 1000000,
    },
    {
        id: '5',
        ten: 'Bãi Sao',
        diaDiem: 'Phú Quốc',
        hinhAnh: 'https://images.unsplash.com/photo-1589394815804-964ce0ff9657?auto=format&fit=crop&q=80',
        moTa: 'Bãi biển tuyệt đẹp với cát trắng mịn màng.',
        loaiHinh: 'Bien',
        danhGia: 4.5,
        giaCa: 2000000,
    },
    {
        id: '6',
        ten: 'Hồ Gươm',
        diaDiem: 'Hà Nội',
        hinhAnh: 'https://images.unsplash.com/photo-1559592413-7cea4ee68f86?auto=format&fit=crop&q=80',
        moTa: 'Trái tim của thủ đô ngàn năm văn hiến.',
        loaiHinh: 'ThanhPho',
        danhGia: 4.7,
        giaCa: 500000,
    }
];

export const getDanhSachDiemDen = async (): Promise<DiemDen[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...mockDiemDen]), 500));
};

export const findDiemDenById = async (id: string): Promise<DiemDen | undefined> => {
    return new Promise(resolve => setTimeout(() => {
        resolve(mockDiemDen.find(d => d.id === id));
    }, 200));
};
