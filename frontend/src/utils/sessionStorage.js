export const SessionStorageKey = {
  access : "access",
  refresh :"refresh",
  sessionTimedOut : "sessionTimedOut",
  authType : "authType",
}


const getItem = (key) => {
  return sessionStorage.getItem(key);
};

const setItem = (key, value) => {
  return sessionStorage.setItem(key, value);
};

const removeItem = (key) => {
  return sessionStorage.removeItem(key);
};

const removeAllItems = () => {
  return sessionStorage.clear();
};


const session = {
  getItem,
  setItem,
  removeItem,
  removeAllItems,
};

export default session;