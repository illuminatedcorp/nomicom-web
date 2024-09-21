import moment from 'moment';
import { writable, get } from 'svelte/store';
import { SITE_MODES } from '@/models/useConstants';

export const styleStore = writable({
	hoveredMode: SITE_MODES.neutral,
	selectedMode: SITE_MODES.neutral
});

export const initStore = async () => {
	const lastModeChange = parseInt(await localStorage.getItem('lastModeChange')) || 0;
	const now = moment().unix();

	// if the last mode change was more than 12 hours ago, we want to reset the selected mode to neutral
	if (now - lastModeChange > 43200) {
		setModes(SITE_MODES.neutral, SITE_MODES.neutral);
	}

	// we want to get the selected mode from local storage
	const selectedMode = (await localStorage.getItem('selectedMode')) || SITE_MODES.neutral;
	styleStore.update((store) => {
		store.selectedMode = selectedMode;
		return store;
	});
};

export const setModes = (hoveredMode, selectedMode) => {
	styleStore.update((store) => {
		store.selectedMode = selectedMode;
		store.hoveredMode = hoveredMode;
		return store;
	});

	// we want to save to local storage
	localStorage.setItem('selectedMode', selectedMode);

	// also want to save the time of the last change as a unix timestamp
	localStorage.setItem('lastModeChange', moment().unix().toString());
};

export const getMode = () => {
	if (get(styleStore).hoveredMode === SITE_MODES.neutral) {
		return get(styleStore).selectedMode;
	} else {
		return get(styleStore).hoveredMode;
	}
};
