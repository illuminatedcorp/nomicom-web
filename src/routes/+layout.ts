import { useAuth } from '@/models/useAuth';
const { onLoad } = useAuth();

export const load = async () => {
	onLoad();
};
