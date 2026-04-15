import { useAuthActions } from '@/hooks/useAuthActions';
import { tenTruongVietTatTiengAnh } from '@/services/base/constant';
import { Button } from 'antd';

const LoginWithKeycloak = () => {
	const { dangNhap } = useAuthActions();

	return (
		<div>
			<Button onClick={dangNhap} type='primary' style={{ marginTop: 8, width: '100%' }} size='large'>
				Bỏ xác thực & mở trang chính
			</Button>
		</div>
	);
};

export default LoginWithKeycloak;
