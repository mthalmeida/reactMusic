import React, { Component } from 'react';
import { shape, func } from 'prop-types';
import Splash from '../Components/Loading';
import { createUser } from '../services/userAPI';
import './styles/login.css';
import LogoImagem from './styles/logo512.png';

export default class Login extends Component {
  constructor() {
    super();
    this.state = { button: false, loading: false, loginName: '' };
  }

  btnValidator = () => {
    const { loginName } = this.state;
    const magicNumber = 3;

    if (loginName.length >= magicNumber) {
      this.setState({ button: true });
    } else {
      this.setState({ button: false });
    }
  };

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value }, this.btnValidator);
  };

  clickButton = async () => {
    const { loginName } = this.state;
    const { history } = this.props;

    this.setState({ loading: true });

    await createUser({ name: loginName });
    this.setState({ loading: false });
    history.push('/search');
  };

  componentDidMount() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.name) {
      this.props.history.push('/search');
    }
  }

  render() {
    const { loginName, loading, button } = this.state;
    if (loading) return <Splash />;

    return (
      <div className="login-container">
        {/* Main content */}
        <div className="login-content">
          {/* Login form card */}
          <div className="login-card" data-testid="page-login">
            <div className="card-header">
              <img src={process.env.PUBLIC_URL + '/logoApp.png'} alt="Logo do App" className="logo-image" style={{ background: 'none', boxShadow: 'none', width: 200, height: 'auto', objectFit: 'contain' }} />
              <h2 className="welcome-text">Sua plataforma de música favorita</h2>
              <p className="welcome-subtitle">Entre com seu nome para continuar</p>
            </div>

            <div className="form-container">
              <div className="input-group">
                <label htmlFor="loginName" className="input-label">Nome</label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <input
                    id="loginName"
                    value={loginName}
                    className="login-input"
                    type="text"
                    name="loginName"
                    data-testid="login-name-input"
                    placeholder="Digite seu nome"
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <button
                className={`login-button ${button ? 'active' : 'disabled'}`}
                name="button"
                type="button"
                data-testid="login-submit-button"
                disabled={!button}
                onClick={this.clickButton}
              >
                <span className="button-text">Entrar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <p className="footer-text">©2025 React Music. Todos os direitos reservados.</p>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  history: shape({ push: func.isRequired }).isRequired,
};
