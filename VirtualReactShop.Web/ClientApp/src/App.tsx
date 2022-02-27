import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import ShoppingCart from './components/ShoppingCart';
import Checkout from './components/Checkout';

import './custom.css'

export default () => (
    <Layout>
        <Route exact path='/' component={ShoppingCart} />
        <Route exact path='/checkout' component={Checkout} />
    </Layout>
);
