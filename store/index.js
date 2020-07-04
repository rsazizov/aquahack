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
    switch (action.type) {
      case 'ADD_FIELD': 
        const { name, apiId } = action;
        const mut = state.slice();
        mut.push({
          name,
          apiId
        })
        return mut;
    }
  }
}

const store = new AppStore();

export {
  dispatcher,
  store
}