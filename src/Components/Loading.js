import React, { Component } from 'react';

export default class Splash extends Component {
  render() {
    const {
      logo = process.env.PUBLIC_URL + '/logoApp.png',
      size = 120,
      background = 'linear-gradient(135deg, #232526 0%, #414345 100%)',
      dropShadow = '0 0 24px #1db95488',
      style = {},
      ...rest
    } = this.props;
    return (
      <div
        className="splash-loading"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background,
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          zIndex: 999,
          ...style,
        }}
        {...rest}
      >
        <img
          src={logo}
          alt="Logo do App"
          style={{
            width: size,
            height: size,
            objectFit: 'contain',
            aspectRatio: '1/1',
            animation: 'pulse 1.2s infinite',
            filter: `drop-shadow(${dropShadow})`,
          }}
        />
        <style>{`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.12); opacity: 0.85; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }
}
