import { useReducer, createContext } from "react";

const initialState = {
  user: null,
  notifications: []
};

export const store = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "set_user":
      return {
        ...state,
        user: action.payload
      };
    case "logout":
      return {
        ...state,
        user: null,
        notifications: []
      };
    default:
      return state;
  }
};

// Exports para useGlobalReducer
export const storeReducer = reducer;
export const initialStore = () => initialState;

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <store.Provider value={{ state, dispatch }}>
      {children}
    </store.Provider>
  );
};