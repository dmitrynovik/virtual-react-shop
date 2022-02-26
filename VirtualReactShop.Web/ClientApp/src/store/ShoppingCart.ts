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
    qty: number;
}

export interface ShoppingCardState {
    isLoading: boolean;
    currencies: Currency[];
    currency: string;    
    product: string;
    products: Map<string, Product>;
}

export interface ListCurrenciesAction { type: 'LIST_CURRENCIES' }
export interface ReceiveCurrenciesAction { type: 'RECEIVE_CURRENCIES', currencies: Currency[] }
export interface ListProductsAction   { type: 'LIST_PRODUCTS'; }
export interface ReceiveProductsAction   { type: 'RECEIVE_PRODUCTS', products: Product[] }
export interface SelectProductAction { type: 'SELECT_PRODUCT', productCode: string }
export interface AddProductAction { type: 'ADD_PRODUCT', productCode: string, productName: string }
export interface RemoveProductAction { type: 'REMOVE_PRODUCT', productCode: string }
export interface ChangeCurrencyAction { type: 'CHANGE_CURRENCY', currencyCode: string }
export interface ClearCartAction { type: 'CLEAR_CART' }
export interface CheckoutAction { type: 'CHECKOUT' }
export interface CalculateShippingAction { type: 'CALCULATE_SHIPPING', products: Product[], currencyCode: string }

type KnownAction = ListCurrenciesAction |
    ReceiveCurrenciesAction |
    ListProductsAction |
    ReceiveProductsAction |
    SelectProductAction |
    AddProductAction |
    RemoveProductAction |
    ChangeCurrencyAction |
    ClearCartAction |
    CheckoutAction |
    CalculateShippingAction;

export const actionCreators = { 

    addProduct: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
    },

    removeProduct: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
    },

    checkout: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
    },

    selectCurrency: (code:string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        console.log('CHANGE_CURRENCY', code);
        dispatch({type: 'CHANGE_CURRENCY', currencyCode: code});
    },

    selectProduct: (code:string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({type: 'SELECT_PRODUCT', productCode: code});
    },

    listProducts: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();

        if (appState && appState.shoppingCart) {
            fetch(`api/products/list`)
                .then(response => response.json() as Promise<Product[]>)
                .then(data => {                    
                    dispatch({ type: 'RECEIVE_PRODUCTS', products: data });
                    
                    if (data.length > 0)
                        dispatch({type: 'SELECT_PRODUCT', productCode: data[0].code});
                });

            dispatch({ type: 'LIST_PRODUCTS' });
        }
    },

    listCurrencies: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();

        if (appState && appState.shoppingCart) {
            fetch(`api/currencies/list`)
                .then(response => response.json() as Promise<Currency[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_CURRENCIES', currencies: data });

                    if (data.length > 0)
                        dispatch({type: 'CHANGE_CURRENCY', currencyCode: data[0].code});

                });

            dispatch({ type: 'LIST_CURRENCIES' });
        }
    }
};

const unloadedState: ShoppingCardState = { 
    currencies: [], 
    currency: 'AUD', // TODO: get from server 
    product: '',
    isLoading: false,
    products: new Map<string, Product>()
};

export const reducer: Reducer<ShoppingCardState> = (state: ShoppingCardState | undefined, incomingAction: Action): ShoppingCardState => {
    //console.log('SHOPPING CARD REDUCER');

    if (state === undefined) {
        return unloadedState;
    }

    // TODO: remove
    // const o1 = Array.from(state.orders.values());
    // //const o2 = [...state.orders];
    // const x = state.orders.values();

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'LIST_PRODUCTS':
        case 'LIST_CURRENCIES':
            return { ...state, isLoading: true };

        case 'RECEIVE_CURRENCIES':
            return { ...state, isLoading: false, currencies: action.currencies };

        case 'RECEIVE_PRODUCTS':
            const map = new Map<string, Product>();
            action.products.forEach(p => map.set(p.code, p));
            return { ...state, isLoading: false, products: map };

        case 'CLEAR_CART':
            return unloadedState;

        case 'CHANGE_CURRENCY':
            return { ...state, currency: action.currencyCode };

        case 'SELECT_PRODUCT':
            return { ...state, product: action.productCode };    
            
        case 'ADD_PRODUCT':
            const products = state.products;
            let order = products.get(action.productCode);
            if (order) {
                order.qty = order.qty + 1;
                products.set(action.productCode, order);
            }
            return { ...state, products: products };        
        }

    return state;
};

