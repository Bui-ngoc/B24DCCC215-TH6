import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Card, Form, Input, InputNumber, Select, Space, Table, Typography } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import DonutChart from '@/components/Chart/DonutChart';
import { tienVietNam } from '@/utils/utils';

const { Title, Text } = Typography;

type CategoryKey = 'anuong' | 'dichuyen' | 'luutru' | 'giaitri';

interface Transaction {
	id: string;
	date: string;
	category: CategoryKey;
	amount: number;
	note?: string;
}

interface CategoryInfo {
	key: CategoryKey;
	label: string;
	color: string;
}

const categories: CategoryInfo[] = [
	{ key: 'anuong', label: 'Ăn uống', color: '#008FFB' },
	{ key: 'dichuyen', label: 'Di chuyển', color: '#00E396' },
	{ key: 'luutru', label: 'Lưu trú', color: '#FEB019' },
	{ key: 'giaitri', label: 'Giải trí', color: '#FF4560' },
];

const localStorageKey = 'quan-ly-ngan-sach';

const defaultBudgets: Record<CategoryKey, number> = {
	anuong: 3000000,
	dichuyen: 2000000,
	luutru: 6000000,
	giaitri: 1500000,
};

const convertVnd = (value: number) => `₫${tienVietNam(value).replace(/,/g, '.').replace(/\.00$/, '')}`;

const QuanLyNganSach = () => {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [budgets, setBudgets] = useState<Record<CategoryKey, number>>(defaultBudgets);
	const [form] = Form.useForm();

	useEffect(() => {
		try {
			const raw = localStorage.getItem(localStorageKey);
			if (raw) {
				const parsed = JSON.parse(raw);
				if (parsed) {
					setTransactions(parsed.transactions || []);
					setBudgets(parsed.budgets || defaultBudgets);
				}
			}
		} catch {
			// ignore
		}
	}, []);

	useEffect(() => {
		localStorage.setItem(localStorageKey, JSON.stringify({ transactions, budgets }));
	}, [transactions, budgets]);

	const statistics = useMemo(() => {
		const items = categories.map((category) => {
			const spent = transactions
				.filter((it) => it.category === category.key)
				.reduce((acc, curr) => acc + curr.amount, 0);
			return {
				...category,
				spent,
				budget: budgets[category.key] || 0,
				remaining: (budgets[category.key] || 0) - spent,
			};
		});
		const totalBudget = items.reduce((sum, i) => sum + i.budget, 0);
		const totalSpent = items.reduce((sum, i) => sum + i.spent, 0);
		const overBudget = items.filter((i) => i.spent > i.budget);

		return { items, totalBudget, totalSpent, overBudget };
	}, [transactions, budgets]);

	const onAddTransaction = (values: { date: string; category: CategoryKey; amount: number; note?: string }) => {
		const newItem: Transaction = {
			id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
			date: values.date,
			category: values.category,
			amount: Number(values.amount),
			note: values.note,
		};
		setTransactions((prev) => [newItem, ...prev]);
		form.resetFields(['date', 'category', 'amount', 'note']);
	};

	const removeTransaction = (id: string) => {
		setTransactions((prev) => prev.filter((i) => i.id !== id));
	};

	const columns = [
		{
			title: 'Ngày',
			dataIndex: 'date',
			key: 'date',
			width: 120,
		},
		{
			title: 'Hạng mục',
			dataIndex: 'category',
			key: 'category',
			width: 140,
			render: (key: CategoryKey) => categories.find((c) => c.key === key)?.label || key,
		},
		{
			title: 'Số tiền',
			dataIndex: 'amount',
			key: 'amount',
			width: 120,
			render: (value: number) => <Text strong>{convertVnd(value)}</Text>,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'note',
			key: 'note',
			ellipsis: true,
		},
		{
			title: 'Hành động',
			key: 'action',
			align: 'center' as const,
			width: 100,
			render: (_: any, record: Transaction) => (
				<Button type='link' danger icon={<DeleteOutlined />} onClick={() => removeTransaction(record.id)}>
					Xóa
				</Button>
			),
		},
	];

	const chartLabels = statistics.items.map((category) => category.label);
	const chartValues = statistics.items.map((category) => category.spent);

	return (
		<Card style={{ minHeight: 'calc(100vh - 120px)' }} bodyStyle={{ padding: 24 }}>
			<Space direction='vertical' size='middle' style={{ width: '100%' }}>
				<Title level={4}>Quản lý ngân sách</Title>

				{statistics.overBudget.length > 0 && (
					<Alert
						type='error'
						showIcon
						message='Quá ngân sách!'
						description={`Có ${statistics.overBudget.length} hạng mục đang vượt ngân sách. Vui lòng kiểm tra và điều chỉnh.`}
					/>
				)}

				<Card>
					<Title level={5}>Tổng quan</Title>
					<Space size='large' wrap style={{ width: '100%', justifyContent: 'space-between' }}>
						<Text>
							Tổng ngân sách: <Text strong>{convertVnd(statistics.totalBudget)}</Text>
						</Text>
						<Text>
							Đã chi: <Text strong>{convertVnd(statistics.totalSpent)}</Text>
						</Text>
						<Text>
							Còn lại: <Text strong>{convertVnd(statistics.totalBudget - statistics.totalSpent)}</Text>
						</Text>
					</Space>
				</Card>

				<Card>
					<Title level={5}>Phân bổ theo hạng mục</Title>
					<DonutChart
						xAxis={chartLabels}
						yAxis={[chartValues]}
						yLabel={chartLabels}
						height={320}
						colors={statistics.items.map((item) => item.color)}
						showTotal
						formatY={(value) => tienVietNam(Number(value))}
					/>
				</Card>

				<Card title='Thiết lập và nhập giao dịch'>
					<Form layout='inline' form={form} onFinish={onAddTransaction} style={{ width: '100%' }}>
						<Form.Item name='date' label='Ngày' rules={[{ required: true, message: 'Chọn ngày' }]}>
							<Input placeholder='YYYY-MM-DD' />
						</Form.Item>

						<Form.Item name='category' label='Hạng mục' rules={[{ required: true, message: 'Chọn hạng mục' }]}>
							<Select
								style={{ width: 180 }}
								options={categories.map((item) => ({ label: item.label, value: item.key }))}
							/>
						</Form.Item>

						<Form.Item name='amount' label='Số tiền' rules={[{ required: true, message: 'Nhập số tiền' }]}>
							<InputNumber<number>
								min={0}
								formatter={(value) => `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								parser={(value) => Number(value?.replace(/\₫|\s|,/g, '')) as number}
							/>
						</Form.Item>

						<Form.Item name='note' label='Ghi chú'>
							<Input placeholder='(Tùy chọn)' />
						</Form.Item>

						<Form.Item>
							<Button htmlType='submit' type='primary' icon={<PlusOutlined />}>
								Thêm giao dịch
							</Button>
						</Form.Item>
					</Form>

					<div style={{ marginTop: 16 }}>
						<Title level={5}>Ngân sách theo hạng mục</Title>
						<Space direction='vertical' size='small' style={{ width: '100%' }}>
							{statistics.items.map((item) => (
								<Card size='small' key={item.key} type='inner'>
									<Space direction='vertical' style={{ width: '100%' }}>
										<Text>{item.label}</Text>
										<Text>
											Ngân sách: <strong>{convertVnd(item.budget)}</strong> - Đã chi:{' '}
											<strong>{convertVnd(item.spent)}</strong> - Còn lại: <strong>{convertVnd(item.remaining)}</strong>
										</Text>
										{item.remaining < 0 ? (
											<Text type='danger'>Vượt {convertVnd(Math.abs(item.remaining))}</Text>
										) : (
											<Text type='success'>Còn lại {convertVnd(item.remaining)}</Text>
										)}
									</Space>
								</Card>
							))}
						</Space>
					</div>
				</Card>

				<Card title='Danh sách giao dịch'>
					<Table
						rowKey='id'
						dataSource={transactions}
						columns={columns}
						pagination={{ pageSize: 6 }}
						scroll={{ x: 600 }}
					/>
				</Card>
			</Space>
		</Card>
	);
};

export default QuanLyNganSach;
