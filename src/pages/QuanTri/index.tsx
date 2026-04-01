import { useEffect, useMemo, useState } from 'react';
import {
	Button,
	Card,
	Col,
	Form,
	Input,
	InputNumber,
	message,
	Modal,
	Progress,
	Row,
	Select,
	Space,
	Statistic,
	Table,
	Tag,
	Upload,
} from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import ColumnChart from '@/components/Chart/ColumnChart';

interface Destination {
	id: string;
	name: string;
	location: string;
	type: 'Biển' | 'Núi' | 'Thành phố' | 'Di sản';
	rating: number;
	description: string;
	visitDays: number;
	costFood: number;
	costLodging: number;
	costTravel: number;
	image?: string;
	createdAt: string;
}

interface Itinerary {
	id: string;
	destinationId: string;
	createdAt: string; // ISO string
	totalCost: number;
}

const DEST_KEY = 'travel_admin_destinations';
const ITINERARY_KEY = 'travel_admin_itineraries';

const defaultData: Destination[] = [
	{
		id: 'DT001',
		name: 'Vịnh Hạ Long',
		location: 'Quảng Ninh',
		type: 'Biển',
		rating: 4.8,
		description: 'Di sản thiên nhiên thế giới, cảnh đẹp tuyệt vời.',
		visitDays: 3,
		costFood: 1200000,
		costLodging: 1800000,
		costTravel: 900000,
		image: '',
		createdAt: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString(),
	},
	{
		id: 'DT002',
		name: 'Sapa',
		location: 'Lào Cai',
		type: 'Núi',
		rating: 4.6,
		description: 'Thị trấn sương mù với ruộng bậc thang nổi tiếng.',
		visitDays: 2,
		costFood: 800000,
		costLodging: 1100000,
		costTravel: 700000,
		image: '',
		createdAt: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
	},
	{
		id: 'DT003',
		name: 'Phố cổ Hội An',
		location: 'Quảng Nam',
		type: 'Thành phố',
		rating: 4.9,
		description: 'Di tích văn hoá lịch sử, ẩm thực đường phố đặc sắc.',
		visitDays: 2,
		costFood: 600000,
		costLodging: 1000000,
		costTravel: 500000,
		image: '',
		createdAt: new Date().toISOString(),
	},
];

const initItineraries = (destinations: Destination[]): Itinerary[] =>
	destinations.map((d, idx) => ({
		id: `IT${idx + 1}`,
		destinationId: d.id,
		createdAt: d.createdAt,
		totalCost: d.costFood + d.costLodging + d.costTravel,
	}));

const AdminPage = () => {
	const [destinations, setDestinations] = useState<Destination[]>([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editingRecord, setEditingRecord] = useState<Destination | null>(null);
	const [form] = Form.useForm();
	const [itineraries, setItineraries] = useState<Itinerary[]>([]);

	useEffect(() => {
		const stored = localStorage.getItem(DEST_KEY);
		const storedItineraries = localStorage.getItem(ITINERARY_KEY);
		if (stored) {
			setDestinations(JSON.parse(stored));
		} else {
			setDestinations(defaultData);
			localStorage.setItem(DEST_KEY, JSON.stringify(defaultData));
		}
		if (storedItineraries) {
			setItineraries(JSON.parse(storedItineraries));
		} else {
			const src = initItineraries(defaultData);
			setItineraries(src);
			localStorage.setItem(ITINERARY_KEY, JSON.stringify(src));
		}
	}, []);

	const saveData = (next: Destination[]) => {
		setDestinations(next);
		localStorage.setItem(DEST_KEY, JSON.stringify(next));
	};

	const saveItineraries = (next: Itinerary[]) => {
		setItineraries(next);
		localStorage.setItem(ITINERARY_KEY, JSON.stringify(next));
	};

	const onAdd = () => {
		setIsEditing(false);
		setEditingRecord(null);
		form.resetFields();
		setIsModalVisible(true);
	};

	const onEdit = (record: Destination) => {
		setIsEditing(true);
		setEditingRecord(record);
		form.setFieldsValue({ ...record });
		setIsModalVisible(true);
	};

	const onDelete = (id: string) => {
		const next = destinations.filter((item) => item.id !== id);
		saveData(next);
		saveItineraries(itineraries.filter((item) => item.destinationId !== id));
		message.success('Xóa điểm đến thành công');
	};

	const createItinerary = () => {
		if (!destinations.length) {
			message.warning('Cần có ít nhất một điểm đến để tạo lịch trình');
			return;
		}
		const random = destinations[Math.floor(Math.random() * destinations.length)];
		const nextItinerary: Itinerary = {
			id: `IT${itineraries.length + 1}`,
			destinationId: random.id,
			createdAt: new Date().toISOString(),
			totalCost: random.costFood + random.costLodging + random.costTravel,
		};
		saveItineraries([...itineraries, nextItinerary]);
		message.success('Đã tạo lịch trình mẫu thành công');
	};

	const onFinish = (values: any) => {
		const { name, location, type, rating, description, visitDays, costFood, costLodging, costTravel, image } = values;
		if (isEditing && editingRecord) {
			const next = destinations.map((item) =>
				item.id === editingRecord.id
					? {
							...item,
							name,
							location,
							type,
							rating,
							description,
							visitDays,
							costFood,
							costLodging,
							costTravel,
							image,
					  }
					: item,
			);
			saveData(next);
			message.success('Cập nhật điểm đến thành công');
		} else {
			const newRec: Destination = {
				id: `DT${Date.now()}`,
				name,
				location,
				type,
				rating,
				description,
				visitDays,
				costFood,
				costLodging,
				costTravel,
				image,
				createdAt: new Date().toISOString(),
			};
			saveData([...destinations, newRec]);
			saveItineraries([
				...itineraries,
				{
					id: `IT${itineraries.length + 1}`,
					destinationId: newRec.id,
					createdAt: newRec.createdAt,
					totalCost: costFood + costLodging + costTravel,
				},
			]);
			message.success('Thêm điểm đến thành công');
		}
		setIsModalVisible(false);
		form.resetFields();
	};

	const onUploadFile = (file: any) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			const imageUrl = e.target?.result as string;
			form.setFieldsValue({ image: imageUrl });
			message.success('Tải ảnh lên thành công');
		};
		reader.readAsDataURL(file);
		return false;
	};

	const totals = useMemo(() => {
		const totalDest = destinations.length;
		const avgRating = totalDest ? destinations.reduce((acc, cur) => acc + cur.rating, 0) / totalDest : 0;
		const totalRevenue = itineraries.reduce((acc, cur) => acc + cur.totalCost, 0);
		const categoryStats = destinations.reduce((acc, cur) => {
			const k = cur.type;
			acc[k] = (acc[k] ?? 0) + cur.costFood + cur.costLodging + cur.costTravel;
			return acc;
		}, {} as Record<string, number>);

		const monthCount = itineraries.reduce((acc, cur) => {
			const d = new Date(cur.createdAt);
			const label = `${d.getMonth() + 1}/${d.getFullYear()}`;
			acc[label] = (acc[label] ?? 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		const popular = [...destinations]
			.sort((a, b) => b.rating - a.rating)
			.slice(0, 5)
			.map((d) => ({ name: d.name, rating: d.rating }));

		return {
			totalDest,
			avgRating,
			totalRevenue,
			categoryStats,
			monthCount,
			popular,
		};
	}, [destinations, itineraries]);

	const dataChart = {
		xAxis: Object.keys(totals.monthCount),
		yAxis: [Object.values(totals.monthCount)],
		yLabel: ['Số lịch trình'],
		title: 'Số lịch trình theo tháng',
	};

	const destColumns = [
		{
			title: 'Ảnh',
			dataIndex: 'image',
			width: 110,
			render: (value: string) =>
				value ? (
					<img src={value} style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 4 }} />
				) : (
					<Tag>Chưa có</Tag>
				),
		},
		{ title: 'Tên điểm đến', dataIndex: 'name', width: 200 },
		{ title: 'Địa điểm', dataIndex: 'location', width: 150 },
		{
			title: 'Loại',
			dataIndex: 'type',
			width: 130,
			render: (value: string) => {
				const color = value === 'Biển' ? 'cyan' : value === 'Núi' ? 'green' : value === 'Thành phố' ? 'blue' : 'purple';
				return <Tag color={color}>{value}</Tag>;
			},
		},
		{ title: 'Đánh giá', dataIndex: 'rating', width: 120, render: (v: number) => <b>{v.toFixed(1)}</b> },
		{ title: 'Số ngày', dataIndex: 'visitDays', width: 100 },
		{
			title: 'Chi phí (VND)',
			children: [
				{ title: 'Ăn uống', dataIndex: 'costFood', width: 110, render: (v: number) => v.toLocaleString() },
				{ title: 'Lưu trú', dataIndex: 'costLodging', width: 110, render: (v: number) => v.toLocaleString() },
				{ title: 'Di chuyển', dataIndex: 'costTravel', width: 110, render: (v: number) => v.toLocaleString() },
			],
		},
		{
			title: 'Tổng chi phí',
			dataIndex: 'totalCost',
			width: 130,
			render: (value: any, record: Destination) =>
				(record.costFood + record.costLodging + record.costTravel).toLocaleString(),
		},
		{
			title: 'Hành động',
			key: 'actions',
			width: 160,
			render: (_: any, record: Destination) => (
				<Space>
					<Button type='link' onClick={() => onEdit(record)}>
						Sửa
					</Button>
					<Button type='link' danger onClick={() => onDelete(record.id)}>
						Xóa
					</Button>
				</Space>
			),
		},
	];

	return (
		<div style={{ padding: 8 }}>
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<Card
						title='Quản lý điểm đến'
						extra={
							<Button icon={<PlusOutlined />} onClick={onAdd}>
								Thêm điểm đến
							</Button>
						}
					>
						<Table
							rowKey='id'
							dataSource={destinations}
							columns={destColumns as any}
							pagination={{ pageSize: 7 }}
							scroll={{ x: 'max-content' }}
						/>
					</Card>
				</Col>

				<Col span={24}>
					<Card title='Thống kê' extra={<Button onClick={createItinerary}>Tạo lịch trình mẫu</Button>}>
						<Row gutter={[16, 16]}>
							<Col xs={24} md={6}>
								<Card>
									<Statistic title='Tổng điểm đến' value={totals.totalDest} />
								</Card>
							</Col>
							<Col xs={24} md={6}>
								<Card>
									<Statistic title='Đánh giá trung bình' value={totals.avgRating.toFixed(1)} suffix='⭐' />
								</Card>
							</Col>
							<Col xs={24} md={6}>
								<Card>
									<Statistic title='Tổng doanh thu' value={totals.totalRevenue.toLocaleString()} suffix='VND' />
								</Card>
							</Col>
							<Col xs={24} md={6}>
								<Card>
									<Statistic title='Số lịch trình' value={itineraries.length} />
								</Card>
							</Col>
						</Row>
						<Row gutter={[16, 16]} style={{ marginTop: 16 }}>
							<Col xs={24} lg={12}>
								<ColumnChart
									title='Lịch trình theo tháng'
									xAxis={dataChart.xAxis}
									yAxis={dataChart.yAxis}
									yLabel={dataChart.yLabel}
									height={290}
								/>
							</Col>
							<Col xs={24} lg={12}>
								<Card title='Chi phí theo loại điểm đến'>
									{Object.entries(totals.categoryStats).map(([type, cost]) => (
										<div key={type} style={{ marginBottom: 12 }}>
											<div style={{ display: 'flex', justifyContent: 'space-between' }}>
												<strong>{type}</strong>
												<span>{cost.toLocaleString()} VND</span>
											</div>
											<Progress percent={Math.min(100, Math.round((cost / Math.max(1, totals.totalRevenue)) * 100))} />
										</div>
									))}
								</Card>
							</Col>
						</Row>
						<Row gutter={[16, 16]} style={{ marginTop: 16 }}>
							<Col span={24}>
								<Card title='Địa điểm phổ biến'>
									<Space direction='vertical' style={{ width: '100%' }}>
										{totals.popular.map((item) => (
											<div key={item.name} style={{ display: 'flex', justifyContent: 'space-between' }}>
												<span>{item.name}</span>
												<Tag color='gold'>{item.rating.toFixed(1)} ⭐</Tag>
											</div>
										))}
									</Space>
								</Card>
							</Col>
						</Row>
					</Card>
				</Col>
			</Row>

			<Modal
				title={isEditing ? 'Chỉnh sửa điểm đến' : 'Thêm điểm đến'}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				onOk={() => form.submit()}
				okText='Lưu'
				cancelText='Hủy'
				width={720}
			>
				<Form
					form={form}
					layout='vertical'
					onFinish={onFinish}
					initialValues={{ type: 'Biển', rating: 4.5, visitDays: 1 }}
				>
					<Row gutter={[16, 16]}>
						<Col span={12}>
							<Form.Item
								name='name'
								label='Tên điểm đến'
								rules={[{ required: true, message: 'Vui lòng nhập tên điểm đến' }]}
							>
								<Input placeholder='Ví dụ: Vịnh Hạ Long' />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name='location'
								label='Địa điểm'
								rules={[{ required: true, message: 'Vui lòng nhập địa điểm' }]}
							>
								<Input placeholder='Ví dụ: Quảng Ninh' />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item
								name='type'
								label='Loại điểm đến'
								rules={[{ required: true, message: 'Vui lòng chọn loại điểm đến' }]}
							>
								<Select
									options={[
										{ label: 'Biển', value: 'Biển' },
										{ label: 'Núi', value: 'Núi' },
										{ label: 'Thành phố', value: 'Thành phố' },
										{ label: 'Di sản', value: 'Di sản' },
									]}
								/>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name='rating' label='Đánh giá' rules={[{ required: true, message: 'Vui lòng nhập đánh giá' }]}>
								<InputNumber min={0} max={5} step={0.1} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item
								name='visitDays'
								label='Số ngày tham quan'
								rules={[{ required: true, message: 'Vui lòng nhập số ngày' }]}
							>
								<InputNumber min={1} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item
								name='costFood'
								label='Chi phí ăn uống (VND)'
								rules={[{ required: true, message: 'Vui lòng nhập chi phí ăn uống' }]}
							>
								<InputNumber min={0} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item
								name='costLodging'
								label='Chi phí lưu trú (VND)'
								rules={[{ required: true, message: 'Vui lòng nhập chi phí lưu trú' }]}
							>
								<InputNumber min={0} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item
								name='costTravel'
								label='Chi phí di chuyển (VND)'
								rules={[{ required: true, message: 'Vui lòng nhập chi phí di chuyển' }]}
							>
								<InputNumber min={0} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item
								name='description'
								label='Mô tả'
								rules={[{ required: true, message: 'Vui lòng nhập mô tả điểm đến' }]}
							>
								<Input.TextArea rows={3} />
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item name='image' label='Upload ảnh điểm đến'>
								<Upload beforeUpload={onUploadFile} showUploadList={false} accept='image/*'>
									<Button icon={<UploadOutlined />}>Chọn ảnh để upload</Button>
								</Upload>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Modal>
		</div>
	);
};

export default AdminPage;
