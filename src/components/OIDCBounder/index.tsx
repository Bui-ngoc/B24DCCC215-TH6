import { primaryColor } from '@/services/base/constant';
import { ConfigProvider } from 'antd';
import { useEffect, type FC } from 'react';

const OIDCBounder: FC = ({ children }) => {
	useEffect(() => {
		ConfigProvider.config({ theme: { primaryColor } });
	}, []);

	return <>{children}</>;
};

export default OIDCBounder;
