import mitt from 'mitt';
export const EventBus = mitt();

export const Events = {
  EXAMPLE_EVENT: 'exampleEvent',
};
