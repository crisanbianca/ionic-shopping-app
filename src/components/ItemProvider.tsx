import {Product} from "./Product";
import PropTypes from 'prop-types';
import React, {useCallback, useEffect, useReducer} from "react";
import {createItem, getItems, newWebSocket, updateItem} from "./api/productsApi";

type SaveItemFn = (item: Product) => Promise<any>;

export interface ItemState {
    items?: Product[],
    fetching: boolean,
    fetchingError?: Error | null,
    saving: boolean,
    savingError?: Error | null,
    saveItem?: SaveItemFn,
}

const initialState: ItemState = {
    fetching: false,
    saving: false,
}

interface ActionProps {
    type: string,
    payload?: any,
}

interface ItemProviderProps {
    children: PropTypes.ReactNodeLike
}

const FETCH_ITEMS_STARTED = 'FETCH_ITEMS_STARTED';
const FETCH_ITEMS_SUCCEEDED = 'FETCH_ITEMS_SUCCEEDED';
const FETCH_ITEMS_FAILED = 'FETCH_ITEMS_FAILED';
const SAVE_ITEM_STARTED = 'SAVE_ITEM_STARTED';
const SAVE_ITEM_SUCCEEDED = 'SAVE_ITEM_SUCCEEDED';
const SAVE_ITEM_FAILED = 'SAVE_ITEM_FAILED';

const reducer: (state: ItemState, action: ActionProps) => ItemState =
    (state, { type, payload }) => {
        switch (type) {
            case FETCH_ITEMS_STARTED:
                return { ...state, fetching: true, fetchingError: null };
            case FETCH_ITEMS_SUCCEEDED:
                return { ...state, items: payload.items, fetching: false };
            case FETCH_ITEMS_FAILED:
                return { ...state, fetchingError: payload.error, fetching: false };
            case SAVE_ITEM_STARTED:
                return { ...state, savingError: null, saving: true };
            case SAVE_ITEM_SUCCEEDED:
                const items = [...(state.items || [])];
                const item = payload.item;
                const index = items.findIndex(it => it.id === item.id);
                if (index === -1) {
                    items.splice(0, 0, item);
                } else {
                    items[index] = item;
                }
                return { ...state, items, saving: false };
            case SAVE_ITEM_FAILED:
                return { ...state, savingError: payload.error, saving: false };
            default:
                return state;
        }
    };

export const ItemContext = React.createContext<ItemState>(initialState);

export const ItemProvider: React.FC<ItemProviderProps> = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const {items, fetching, fetchingError, saving, savingError} = state;
    useEffect(getItemsEffect, []);
    useEffect(notifyEffect, []);
    const saveItem = useCallback<SaveItemFn>(saveItemCallback, []);
    const value = {items, fetching, fetchingError, saving, savingError, saveItem};

    return (
        <ItemContext.Provider value={value}>
            {children}
        </ItemContext.Provider>
    );

    function getItemsEffect() {
        let canceled = false;
        fetchItems();
        return () => {
            canceled = true;
        }

        async function fetchItems() {
            try {
                //TODO Pune logs
                dispatch({type: FETCH_ITEMS_STARTED});
                const items = await getItems();
                if (!canceled) {
                    dispatch({type: FETCH_ITEMS_SUCCEEDED, payload: {items}})
                }
            } catch (e) {
                dispatch({type: FETCH_ITEMS_FAILED, payload: {e}})
            }
        }
    }

    async function saveItemCallback(Product: Product) {
        try {
            dispatch({type: SAVE_ITEM_STARTED});
            const savedItem = await (Product.id ? updateItem(Product) : createItem(Product));
            dispatch({type: SAVE_ITEM_SUCCEEDED, payload: {item: savedItem}});
        } catch (e) {
            dispatch({type: SAVE_ITEM_FAILED, payload: {e}})
        }
    }
    
    function notifyEffect() {
        let canceled = false;
        const closeWebSocket = newWebSocket(message => {
            if (canceled) {
                return;
            }

            const {event, payload: {item}} = message;
            if (event === 'created' || event === 'updated') {
                dispatch({type: SAVE_ITEM_SUCCEEDED, payload:{item}});
            }
        });

        return () => {
            canceled = true;
            closeWebSocket();
        }
    }
};