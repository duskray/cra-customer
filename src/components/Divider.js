import React, { Component } from 'react';

export default class Divider extends Component {
  render() {
    return <div style={{
      boxSizing: 'border-box',
      color: 'rgba(0, 0, 0, 0.65)',
      lineHeight: 1.5,
      fontSize: 14,
      fontVariant: 'tabular-nums',
      padding: 0,
      listStyle: 'none',
      background: '#e8e8e8',
      margin: '0 8px',
      display: 'inline-block',
      width: 1,
      verticalAlign: 'middle',
      position: 'relative',
      height: this.props.height || '0.9em',
      top: this.props.top || '-0.06em',
    }}></div>
  }
}