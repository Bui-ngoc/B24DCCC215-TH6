import type { DiemDen } from '@/models/diemden/diemden';

export interface NgayLichTrinh {
    ngay: number; // Ngày 1, Ngày 2
    diemDens: DiemDen[];
}

export interface LichTrinh {
    id: string;
    tenLichTrinh: string;
    ngayBatDau?: string;
    ngayKetThuc?: string;
    chiTiet: NgayLichTrinh[];
    tongNganSach: number;
}
