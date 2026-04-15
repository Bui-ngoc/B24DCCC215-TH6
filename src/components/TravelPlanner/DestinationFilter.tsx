import React from 'react';
import { Form, Select, Radio, Button } from 'antd';
import { UndoOutlined } from '@ant-design/icons';

export interface FilterValues {
    loaiHinh?: 'Bien' | 'Nui' | 'ThanhPho';
    sortBy?: 'giaCaAsc' | 'giaCaDesc' | 'danhGiaDesc';
}

interface DestinationFilterProps {
    onFilterChange: (values: FilterValues) => void;
}

const DestinationFilter: React.FC<DestinationFilterProps> = ({ onFilterChange }) => {
    const [form] = Form.useForm();

    const handleChange = () => {
        onFilterChange(form.getFieldsValue());
    };

    const handleReset = () => {
        form.resetFields();
        onFilterChange({});
    };

    return (
        <Form form={form} layout="inline" onValuesChange={handleChange} style={{ marginBottom: 24, gap: '12px' }}>
            <Form.Item name="loaiHinh" label="Loại hình" style={{ marginBottom: '12px' }}>
                <Select placeholder="Chọn loại hình" style={{ width: 150 }} allowClear>
                    <Select.Option value="Bien">Biển</Select.Option>
                    <Select.Option value="Nui">Núi</Select.Option>
                    <Select.Option value="ThanhPho">Thành Phố</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item name="sortBy" label="Sắp xếp theo" style={{ marginBottom: '12px' }}>
                <Radio.Group>
                    <Radio.Button value="danhGiaDesc">Đánh giá cao nhất</Radio.Button>
                    <Radio.Button value="giaCaAsc">Giá thấp đến cao</Radio.Button>
                    <Radio.Button value="giaCaDesc">Giá cao đến thấp</Radio.Button>
                </Radio.Group>
            </Form.Item>

            <Form.Item style={{ marginBottom: '12px' }}>
                <Button icon={<UndoOutlined />} onClick={handleReset}>
                    Đặt lại
                </Button>
            </Form.Item>
        </Form>
    );
};

export default DestinationFilter;
