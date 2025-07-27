import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getUser, updateUser } from '../services/userAPI';
import './styles/profileEdit.css';
import Splash from '../Components/Loading';

export default class ProfileEdit extends Component {
  constructor() {
    super();
    this.state = {
      user: { name: '', email: '', description: '', },
      loading: true,
      isUpdating: false,
    };
  }

  componentDidMount() { this.getUserInfo(); }

  getUserInfo = async () => {
    const user = await getUser();
    this.setState({ user, loading: false });
  };

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState((prevState) => ({
      user: { ...prevState.user, [name]: value },
    }));
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { user } = this.state;
    
    this.setState({ isUpdating: true });
    
    try {
      await updateUser(user);
      // Redirecionar para a página de perfil após salvar
      window.location.href = '/profile';
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      this.setState({ isUpdating: false });
    }
  };

  render() {
    const { user, loading, isUpdating } = this.state;

    if (loading) {
      return (
        <Splash />
      );
    }

    return (
      <div data-testid="page-profile-edit">
        <div className="profile-edit-content">
          <h1 className="profile-edit-title">Editar Perfil</h1>
          <div className="profile-edit-card">
            <form className="edit-form" onSubmit={this.handleSubmit}>
              <div className="input-group">
                <label className="input-label" htmlFor="name">Nome</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={user.name}
                  onChange={this.handleChange}
                  className="input-field"
                  placeholder="Digite seu nome"
                  required
                />
              </div>
              
              <div className="input-group">
                <label className="input-label" htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={user.email}
                  onChange={this.handleChange}
                  className="input-field"
                  placeholder="Digite seu email"
                  required
                />
              </div>
              
              <div className="input-group">
                <label className="input-label" htmlFor="description">Descrição</label>
                <textarea
                  id="description"
                  name="description"
                  value={user.description}
                  onChange={this.handleChange}
                  className="textarea-field"
                  placeholder="Digite sua descrição"
                  rows="4"
                />
              </div>
              
              <div className="buttons-container">
                <button
                  type="submit"
                  className="save-button"
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Salvando...' : 'Salvar'}
                </button>
                <Link to="/profile" className="cancel-button">
                  Cancelar
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
