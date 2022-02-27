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
    priceInBaseCurrency: number;
    qty: number;
}

export interface ShoppingCardState {
    isLoading: boolean;
    currencies: Currency[];
    currentCurrency: Currency;    
    currentProduct: Product | undefined;
    products:Product[];
    total: number;
}

export interface Total {
    amount: number;
}

export interface ListCurrenciesAction { type: 'LIST_CURRENCIES' }
export interface ReceiveCurrenciesAction { type: 'RECEIVE_CURRENCIES', currencies: Currency[] }
export interface ListProductsAction   { type: 'LIST_PRODUCTS'; }
export interface ReceiveProductsAction   { type: 'RECEIVE_PRODUCTS', products: Product[] }
export interface SelectProductAction { type: 'SELECT_PRODUCT', productCode: string }
export interface AddProductAction { type: 'ADD_PRODUCT' }
export interface RemoveProductAction { type: 'REMOVE_PRODUCT' }
export interface ChangeCurrencyAction { type: 'CHANGE_CURRENCY', currencyCode: string }
export interface ClearCartAction { type: 'CLEAR_CART' }
export interface CheckoutAction { type: 'CHECKOUT', total: number }
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

    calcPrice: (p: Product): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const basePrice = p.priceInBaseCurrency * p.qty;
        const state = getState();
        const price = state.shoppingCart != undefined ? basePrice * state.shoppingCart.currentCurrency.baseExchangeRate : basePrice;
        return Math.round(price * 100.0) / 100.0; // Round to cents
    },

    calcSum: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const state = getState();
        let sum = 0;

        state.shoppingCart?.products.forEach(p => {
            const basePrice = p.priceInBaseCurrency * p.qty;
            const state = getState();
            sum += basePrice * (state.shoppingCart?.currentCurrency?.baseExchangeRate || 0);
    
        });
        return Math.round(sum * 100) / 100;
    },

    addProduct: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const state = getState();
        dispatch({type: 'ADD_PRODUCT'});
    },

    removeProduct: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({type: 'REMOVE_PRODUCT'});
    },

    checkout: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();

        if (appState && appState.shoppingCart) {
            const products = appState.shoppingCart.products.filter(p => p.qty > 0);
            const payload = { orders: products, currencyCode: appState.shoppingCart.currentCurrency.code };

            fetch('api/shipping', {
                    method: 'post',
                    body: JSON.stringify(payload),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                .then(response => response.json() as Promise<Total>)
                .then(data => dispatch({type: 'CHECKOUT', total: data.amount}));
        }
    },

    selectCurrency: (code: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
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
    currentCurrency: { code: 'AUD', name: 'Australian Dollar', baseExchangeRate: 1.0 },  // TODO: get from server 
    currentProduct: undefined,
    isLoading: false,
    products: [],
    total: 0
};

export const reducer: Reducer<ShoppingCardState> = (state: ShoppingCardState | undefined, incomingAction: Action): ShoppingCardState => {
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
            const products = action.products.map ( p => {
                p.qty = 0;
                return p;
            });
            return { ...state, isLoading: false, products: products };

        case 'CLEAR_CART':
            return unloadedState;

        case 'CHANGE_CURRENCY':
            const currentCurrency = state.currencies.find(c => c.code == action.currencyCode);
            return { ...state, currentCurrency: currentCurrency || unloadedState.currentCurrency };

        case 'SELECT_PRODUCT':
            const currentProduct = state.products.find(c => c.code == action.productCode);
            return { ...state, currentProduct: currentProduct };    

        case 'ADD_PRODUCT':
            let order = state.products.find(p => p.code == state.currentProduct?.code);
            if (order) {
                order.qty = order.qty + 1;
                const products = state.products.filter(p => p.code != state?.currentProduct?.code);
                return { ...state, products: [...products, order] };        
            } else {
                return { ...state, products: state.products };        
            }

        case 'REMOVE_PRODUCT':
            let orderToRemove = state.products.find(p => p.code == state.currentProduct?.code);
            if (orderToRemove) {
                orderToRemove.qty = orderToRemove.qty - 1;
                const products = state.products.filter(p => p.code != state.currentProduct?.code);
                return { ...state, products: [...products, orderToRemove] };        
            }
            return { ...state, products: state.products };            

        case 'CHECKOUT':
            return { ...state, total: action.total };
        }

    return state;
};

