import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { NavItem, NavLink } from 'reactstrap';
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
        <NavLink tag={Link} className="btn btn-secondary btn-lg float-right" to="/checkout">Checkout</NavLink>
        <br />
        <br />
        {this.renderOrders()}
      </React.Fragment>
    );
  }

  private ensureDataFetched() {
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
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
        {         
          this.props.products.map(order => 
            {
            return order && order.qty > 0 ?
            <tr key={order.code}>
              <td>{order.name}</td>
              <td>{order.qty}</td>
              <td>{this.props.calcPrice(order)}</td>
            </tr> : undefined;
            }
          )}
          <tr>
            <td><b>Subtotal</b></td>
            <td></td>
            <td><b>{this.props.calcSum()}</b></td>
          </tr>
        </tbody>
      </table>
    );
  }

  private renderProducts() {
    return (
      <select id="products" className="form-control" onChange={event => this.props.selectProduct(event.target.value)}>
          { 
            this.props.products.map(product => 
              {
                return <option key={product.code} value={product.code}>{product.name}</option>;
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
