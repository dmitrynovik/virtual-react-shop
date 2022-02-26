import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';

export interface Currency {
    code: string;
    name: string;
    baseExchangeRate: number;
}

export interface Product {
    code: string;
    name: string;
    priceInBaseCurrency: string;
}

export interface ShoppingCardState {
    isLoading: boolean;
    products: Product[];
    currencies: Currency[];
    currency: string;
    orders: Map<string, number>;
}

export interface ListCurrenciesAction { type: 'LIST_CURRENCIES' }
export interface ReceiveCurrenciesAction { type: 'RECEIVE_CURRENCIES', currencies: Currency[] }
export interface ListProductsAction   { type: 'LIST_PRODUCTS'; }
export interface ReceiveProductsAction   { type: 'RECEIVE_PRODUCTS', products: Product[] }
export interface AddProductAction { type: 'ADD_PRODUCT', productCode: string }
export interface RemoveProductAction { type: 'REMOVE_PRODUCT', productCode: string }
export interface ChangeCurrencyAction { type: 'CHANGE_CURRENCY', currencyCode: string }
export interface ClearCartAction { type: 'CLEAR_CART' }
export interface CheckoutAction { type: 'CHECKOUT' }
export interface CalculateShippingAction { type: 'CALCULATE_SHIPPING', products: Product[], currencyCode: string }

type KnownAction = ListCurrenciesAction |
    ReceiveCurrenciesAction |
    ListProductsAction |
    ReceiveProductsAction |
    AddProductAction |
    RemoveProductAction |
    ChangeCurrencyAction |
    ClearCartAction |
    CheckoutAction |
    CalculateShippingAction;

export const actionCreators = { 

    listProducts: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        console.log('listProducts');

        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();

        if (appState && appState.shoppingCart) {
            fetch(`api/products/list`)
                .then(response => response.json() as Promise<Product[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_PRODUCTS', products: data });
                });

            dispatch({ type: 'LIST_PRODUCTS' });
        }
    },

    listCurrencies: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        console.log('listCurrencies');

        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();

        if (appState && appState.shoppingCart) {
            fetch(`api/currencies/list`)
                .then(response => response.json() as Promise<Currency[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_CURRENCIES', currencies: data });
                });

            dispatch({ type: 'LIST_CURRENCIES' });
        }
    }
};

const unloadedState: ShoppingCardState = { 
    products: [], 
    currencies: [], 
    currency: 'AUD', // TODO: get from server 
    isLoading: false,
    orders: new Map<string, number>()
};

export const reducer: Reducer<ShoppingCardState> = (state: ShoppingCardState | undefined, incomingAction: Action): ShoppingCardState => {
    console.log('SHOPPING CARD REDUCER');

    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'LIST_PRODUCTS':
        case 'LIST_CURRENCIES':
            return { ...state, isLoading: true };
        case 'RECEIVE_CURRENCIES':
            return { ...state, isLoading: false, currencies: action.currencies };
        case 'RECEIVE_PRODUCTS':
            return { ...state, isLoading: false, products: action.products };
        case 'CLEAR_CART':
            return unloadedState;
    }

    return state;
};

