import React from 'react';
import PropTypes from 'prop-types';
import Theme from './Theme';
import { StyleContext } from './StyleProviderContext';

export default class StyleProvider extends React.PureComponent {
  static propTypes = {
    children: PropTypes.element.isRequired,
    style: PropTypes.object
  };

  static defaultProps = {
    style: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      theme: this.createTheme(props)
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.style !== this.props.style) {
      this.setState({
        theme: this.createTheme(this.props)
      });
    }
  }

  createTheme(props) {
    return new Theme(props.style);
  }

  render() {
    const { children } = this.props;
    const { theme } = this.state;

    return (
      <StyleContext.Provider value={theme}>
        {children}
      </StyleContext.Provider>
    );
  }
}
