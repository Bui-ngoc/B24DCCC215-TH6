import type { LichTrinh } from '@/models/lichtrinh/lichtrinh';

let mockLichTrinh: LichTrinh = {
    id: '1',
    tenLichTrinh: 'Chuyến đi khám phá Việt Nam',
    chiTiet: [],
    tongNganSach: 0,
};

export const getLichTrinh = async (): Promise<LichTrinh> => {
    return new Promise(resolve => setTimeout(() => resolve({ ...mockLichTrinh }), 200));
};

export const saveLichTrinh = async (lichtrinh: LichTrinh): Promise<LichTrinh> => {
    mockLichTrinh = { ...lichtrinh };
    return new Promise(resolve => setTimeout(() => resolve(mockLichTrinh), 200));
};
