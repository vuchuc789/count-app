import action, { DATABASE_INITIATED } from './actionTypes';

const databaseActions = {
  initiated: () => action(DATABASE_INITIATED),
};

export default databaseActions;
