import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as ShoppingCardStore from '../store/ShoppingCart';

// At runtime, Redux will merge together...
type ShoppingCardProps =
ShoppingCardStore.ShoppingCardState // ... state we've requested from the Redux store
  & typeof ShoppingCardStore.actionCreators // ... plus action creators we've requested
  & RouteComponentProps<{  }>; // ... plus incoming routing parameters


class ShoppingCart extends React.PureComponent<ShoppingCardProps> {
  // This method is called when the component is first added to the document
  public componentDidMount() {
    console.log('componentDidMount');
    this.ensureDataFetched();
  }

  // This method is called when the route parameters change
  public componentDidUpdate() {
    console.log('componentDidUpdate');
    //this.ensureDataFetched();
  }

  public render() {
    console.log('rendering...');

    return (
      <React.Fragment>
        <br />
        <h1 id="tabelLabel">Shopping card</h1>
        <h2>Currencies</h2>
        {this.renderCurrencies()}
        <br />
        <h2>Products</h2>
        {this.renderProducts()}
        <br />
        <button className="btn btn-secondary btn-lg" onClick={() => this.props.addProduct() }>Add Product</button>&nbsp;
        <button className="btn btn-secondary btn-lg" onClick={() => this.props.removeProduct() }>Remove Product</button>
        <button className="btn btn-secondary btn-lg float-right" onClick={() => this.props.checkout() }>Checkout</button>
        <br />
        <br />
        {this.renderOrders()}
      </React.Fragment>
    );
  }

  private ensureDataFetched() {
    console.log('fetching data...');
    this.props.listCurrencies();
    this.props.listProducts();
  }

  private renderOrders() {
    return (
      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th>Product</th>
            <th>Quantity</th>
          </tr>
        </thead>
        {         
          Array.from(this.props.products.keys()).map(productCode => 
            {
            const order = this.props.products.get(productCode);
            return order && order.qty > 0 ?
            <tr>
              <td>{order.name}</td>
              <td>{order.qty}</td>
            </tr> : undefined;
            }
          )}
      </table>
    );
  }

  private renderProducts() {
    return (
      <select id="products" className="form-control" onChange={event => this.props.selectProduct(event.target.value)}>
          { 
            Array.from(this.props.products.keys()).map(productCode => 
              {
                const product = this.props.products.get(productCode);                
                return product ? <option key={product.code} value={product.code}>{product.name}</option> : undefined;
              }
          )}
      </select>
    );
  }

  private renderCurrencies() {
    return (
      <select id="currencies" className="form-control" onChange={event => this.props.selectCurrency(event.target.value)}>
          {this.props.currencies.map((currency: ShoppingCardStore.Currency) =>
            <option key={currency.code} value={currency.code}>{currency.name}</option>
          )}
      </select>
    );
  }

}

export default connect(
  (state: ApplicationState) => state.shoppingCart, // Selects which state properties are merged into the component's props
  ShoppingCardStore.actionCreators // Selects which action creators are merged into the component's props
)(ShoppingCart as any); // eslint-disable-line @typescript-eslint/no-explicit-any
