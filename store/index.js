import { Dispatcher } from 'flux';
import { ReduceStore, Container } from 'flux/utils';

const dispatcher = new Dispatcher();

class AppStore extends ReduceStore {
  constructor() {
    super(dispatcher);
  }

  getInitialState() {
    return [];
  }

  reduce(state, action) {
    console.log('reduce', action)
    switch (action.type) {
      case 'ADD_FIELD': 
        const { type, ...field} = action;
        const mut = state.slice();
        mut.push(action)
        return mut;
    }
  }
}

const store = new AppStore();

export {
  dispatcher,
  store
}