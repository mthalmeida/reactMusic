import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getUser } from '../services/userAPI';
import './styles/profile.css';
import Splash from '../Components/Loading';

export default class Profile extends Component {
  constructor() {
    super();
    this.state = { user: {}, loading: true, };
  }

  componentDidMount() { this.getUserInfo(); }

  getUserInfo = async () => {
    const user = await getUser();
    this.setState({ user, loading: false });
  };

  handleLogout = () => {
    localStorage.removeItem('user');
    this.props.history.push('/');
  };

  render() {
    const { user, loading } = this.state;

    if (loading) {
      return <Splash />;
    }

    return (
      <div data-testid="page-profile">
        <div className="profile-content">
          <h1 className="profile-title">Perfil</h1>
          <div className="profile-card">
            <div className="user-info">
              <div className="info-item">
                <span className="info-label">Nome</span>
                <span className="info-value">{user.name || 'Não informado'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email</span>
                <span className="info-value">{user.email || 'Não informado'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Descrição</span>
                <span className="info-value">{user.description || 'Não informado'}</span>
              </div>
            </div>
            <Link to="/profile/edit">
              <button className="edit-button" type="button">Editar perfil</button>
            </Link>
            <button className="logout-button" type="button" onClick={this.handleLogout}>Sair</button>
          </div>
        </div>
      </div>
    );
  }
}
