import mitt from 'mitt';
export const EventBus = mitt();

export const Events = {
	UPDATE_WIKI_INDEX: 'updateWikiIndex'
};
