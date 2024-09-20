import { writable, get } from 'svelte/store';
import { SITE_MODES } from '@/models/useConstants';

export const styleStore = writable({
	hoveredMode: SITE_MODES.neutral,
	selectedMode: SITE_MODES.neutral
});

export const getMode = () => {
	if (get(styleStore).hoveredMode === SITE_MODES.neutral) {
		return get(styleStore).selectedMode;
	} else {
		return get(styleStore).hoveredMode;
	}
};
