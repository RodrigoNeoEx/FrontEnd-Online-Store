import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import * as api from '../services/api';
import ItemCard from './itemCard';
import CategoriesList from './categoriesList';
import dataCart from '../services/dataCart';
import './css/componentInput.css';

class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      inputValue: '',
      categoryValue: '',
      cartCounter: 0,
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleButton = this.handleButton.bind(this);
    this.handleCategory = this.handleCategory.bind(this);
    this.globalCounter = this.globalCounter.bind(this);
  }

  componentDidMount() {
    this.globalCounter();
  }

  handleInput({ target }) {
    this.setState({ inputValue: target.value });
  }

  handleCategory({ target }) {
    this.setState({ categoryValue: target.value }, () => (
      this.handleButton()
    ));
  }

  handleButton() {
    const { inputValue, categoryValue } = this.state;
    console.log(categoryValue);
    api.getProductsFromCategoryAndQuery(categoryValue, inputValue)
      .then((queryValue) => {
        this.setState({ products: queryValue });
      });
  }

  globalCounter() {
    let counter = 0;
    dataCart.array.forEach((product) => { counter += product.quantity; });
    this.setState({ cartCounter: counter });
  }

  render() {
    const { products, inputValue, cartCounter } = this.state;
    return (
      <div>
        <div className="headerInput">
          <div className="inputContainer">
            <input className="mainInput" value={ inputValue } type="text" data-testid="query-input" onChange={ this.handleInput } />
            <button
              className="search"
              type="button"
              data-testid="query-button"
              onClick={ this.handleButton }
            >
              <FaSearch />
            </button>
          </div>
          <div className="cartContainer">
            <Link to="/cart" data-testid="shopping-cart-button">
              <AiOutlineShoppingCart className="cart" />
              <p data-testid="shopping-cart-size" className="counter">{ cartCounter }</p>
            </Link>

          </div>
          <p data-testid="home-initial-message" className="mainText">
            Digite algum termo de pesquisa ou escolha uma categoria.
          </p>
        </div>

        <div className="inputMainContent">
          <div className="category">
            <CategoriesList handleCat={ this.handleCategory } />
          </div>
          <div className="products">
            {products.length < 1 ? <p>Nenhum produto foi encontrado</p>
              : products.results.map((item) => (
                <ItemCard
                  key={ item.id }
                  products={ item }
                  globalCounter={ this.globalCounter }
                  cartCounter={ cartCounter }
                />))}
          </div>
        </div>
      </div>
    );
  }
}

export default Input;
