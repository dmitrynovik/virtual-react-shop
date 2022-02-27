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


class Checkout extends React.PureComponent<ShoppingCardProps> {

    public render() {

        this.props.checkout();

        return <div>
            <div>
                <b>Total: {this.props.total}</b>
            </div>
            <p>Thanks you for you shopping</p>
        </div>
    }
}

export default connect(
    (state: ApplicationState) => state.shoppingCart, // Selects which state properties are merged into the component's props
    ShoppingCardStore.actionCreators // Selects which action creators are merged into the component's props
  )(Checkout as any); // eslint-disable-line @typescript-eslint/no-explicit-any
  