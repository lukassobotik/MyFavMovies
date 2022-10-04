import {useReducer, createContext} from "react";

const initialState = {
    user: null,
}

const GlobalStateContext = createContext();

function reducer(state, action) {
    switch (action.type) {
        case 'login': {
            return {
                ...this.state,
                user: action.user
            }
        }
        case 'logout': {
            return {
                ...this.state,
                user: null
            }
        }
        default: {
            throw new Error();
        }
    }
}

export default function useGlobalState() {
    const [state, dispatch] = useReducer(reducer, initialState);

    return {
        StateProvider: function ({children}) {
            return <GlobalStateContext.Provider value ={{state, dispatch}}>{children}</GlobalStateContext.Provider>
        },
        StateContext: GlobalStateContext,
    }
}