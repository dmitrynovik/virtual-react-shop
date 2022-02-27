export const testState = {
    shoppingCart: {
      currencies: [
        {
          code: 'AUD',
          baseExchangeRate: 1,
          name: 'Australian Dollar'
        },
        {
          code: 'USD',
          baseExchangeRate: 0.72,
          name: 'United States Dollar'
        },
        {
          code: 'CNY',
          baseExchangeRate: 5,
          name: 'Chinese Renminbi'
        }
      ],
      currentCurrency: {
        code: 'AUD',
        baseExchangeRate: 1,
        name: 'Australian Dollar'
      },
      currentProduct: {
        code: 'SKU001',
        priceInBaseCurrency: 1.01,
        name: 'Sunsoft Toilet Paper',
        qty: 0
      },
      isLoading: false,
      products: [
        {
          code: 'SKU001',
          priceInBaseCurrency: 1.01,
          name: 'Sunsoft Toilet Paper',
          qty: 0
        },
        {
          code: 'SKU002',
          priceInBaseCurrency: 2.02,
          name: 'Liquid soap',
          qty: 0
        },
        {
          code: 'SKU003',
          priceInBaseCurrency: 3.03,
          name: 'Gentle Toothbrush',
          qty: 0
        }
      ],
      total: 0
    },
    router: {
      location: {
        pathname: '/',
        search: '',
        hash: ''
      },
      action: 'POP'
    }
  };
