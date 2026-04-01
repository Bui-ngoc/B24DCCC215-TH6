export interface DiemDen {
    id: string;
    ten: string;
    diaDiem: string; // Tỉnh / Thành phố
    hinhAnh: string;
    moTa: string;
    loaiHinh: 'Bien' | 'Nui' | 'ThanhPho';
    danhGia: number; // 1-5
    giaCa: number; // Giá trị ước tính
}
