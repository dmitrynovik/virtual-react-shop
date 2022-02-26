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


class FetchData extends React.PureComponent<ShoppingCardProps> {
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
    return (
      <React.Fragment>
        <h1 id="tabelLabel">Shopping card</h1>
        <h2>Currencies</h2>
        {this.renderCurrencies()}
        <h2>Products</h2>
        {this.renderProducts()}
      </React.Fragment>
    );
  }

  private ensureDataFetched() {
    console.log('ensureDataFetched');
    this.props.listCurrencies();
    this.props.listProducts();
  }

  private renderProducts() {
    return (
      <select id="products">
          { this.props.products.map((product: ShoppingCardStore.Product) =>
            <option key={product.code}>{product.name}</option>
          )}
      </select>
    );
  }

  private renderCurrencies() {
    return (
      <select id="currencies">
          {this.props.currencies.map((currency: ShoppingCardStore.Currency) =>
            <option key={currency.code}>{currency.name}</option>
          )}
      </select>
    );
  }

}

export default connect(
  (state: ApplicationState) => state.shoppingCart, // Selects which state properties are merged into the component's props
  ShoppingCardStore.actionCreators // Selects which action creators are merged into the component's props
)(FetchData as any); // eslint-disable-line @typescript-eslint/no-explicit-any
