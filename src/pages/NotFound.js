import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './styles/notFound.css';

export default class NotFound extends Component {
  render() {
    return (
      <div data-testid="page-not-found">
        <div className="not-found-content">
          <div className="error-icon">🎵</div>
          <h1 className="error-title">404</h1>
          <p className="error-message">
            Ops! Parece que você se perdeu na música.
            <br />
            Esta página não foi encontrada.
          </p>
          <Link to="/search" className="back-button">
            Voltar para a busca
          </Link>
        </div>
      </div>
    );
  }
}
