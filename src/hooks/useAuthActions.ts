import { deleteOneSignal } from '@/services/base/api';
import { currentRole, oneSignalRole } from '@/utils/ip';
import OneSignal from 'react-onesignal';
import { useModel } from 'umi';

export const useAuthActions = () => {
	const { initialState, setInitialState } = useModel('@@initialState');

	const handleLogout = () => {
		if (oneSignalRole.valueOf() === currentRole.valueOf()) {
			OneSignal.getUserId((playerId) => deleteOneSignal({ playerId }));
			OneSignal.setSubscription(false);
		}

		sessionStorage.clear();
		localStorage.clear();
		setInitialState({ ...initialState, currentUser: undefined });
		window.location.href = '/dashboard';
	};

	const handleLogin = () => {
		window.location.href = '/dashboard';
	};

	return {
		dangXuat: handleLogout,
		dangNhap: handleLogin,
		isLoading: false,
	};
};
