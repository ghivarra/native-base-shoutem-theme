import React from "react";
import PropTypes from "prop-types";
import hoistStatics from "hoist-non-react-statics";
import * as _ from "lodash";

import Theme from "./Theme";
import { resolveComponentStyle } from "./resolveComponentStyle";
import { StyleContext } from "./StyleContext";

let themeCache = {};

export function clearThemeCache() {
  themeCache = {};
}

function isStyleVariant(propertyName) {
  return /^\./.test(propertyName);
}

function isChildStyle(propertyName) {
  return /(^[^\.].*\.)|^\*$/.test(propertyName);
}

function getConcreteStyle(style) {
  return _.pickBy(style, (value, key) => {
    return !isStyleVariant(key) && !isChildStyle(key);
  });
}

export default (
  componentStyleName,
  componentStyle = {},
  mapPropsToStyleNames,
  options = {}
) => WrappedComponent => {
  class StyledCore extends React.PureComponent {
    static propTypes = {
      style: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.number,
        PropTypes.array
      ]),
      styleName: PropTypes.string,
      virtual: PropTypes.bool,
      __theme: PropTypes.object,
      forwardedRef: PropTypes.any
    };

    static defaultProps = {
      virtual: options.virtual
    };

    constructor(props) {
      super(props);
      const styleNames = this.getStyleNames(props);
      const style = this.buildStyle(props, styleNames);

      this.state = {
        style,
        styleNames
      };
    }

    getStyleNames(props) {
      const names = _.map(props, (value, key) =>
        typeof value !== "object" && value === true ? "." + key : false
      );
      _.remove(names, v => v === false);
      return names;
    }

    buildStyle(props, styleNames) {
      const theme = props.__theme || Theme.getDefaultTheme();

      const themeStyle = theme.createComponentStyle(
        componentStyleName,
        componentStyle
      );

      const resolvedStyle = resolveComponentStyle(
        componentStyleName,
        styleNames,
        themeStyle,
        {}
      );

      const concreteStyle = getConcreteStyle(
        _.merge({}, resolvedStyle)
      );

      if (_.isArray(props.style)) {
        return [concreteStyle, ...props.style];
      }

      if (
        typeof props.style === "number" ||
        typeof props.style === "object"
      ) {
        return [concreteStyle, props.style];
      }

      return concreteStyle;
    }

    componentDidUpdate(prevProps) {
      const nextStyleNames = this.getStyleNames(this.props);

      if (
        prevProps.__theme !== this.props.__theme ||
        prevProps.style !== this.props.style ||
        !_.isEqual(this.state.styleNames, nextStyleNames)
      ) {
        const style = this.buildStyle(this.props, nextStyleNames);
        this.setState({ style, styleNames: nextStyleNames });
      }
    }

    render() {
      const { style, __theme, forwardedRef, ...rest } = this.props;
      
      return (
        <WrappedComponent
          {...rest}
          style={this.state.style}
          ref={forwardedRef}
        />
      );
    }
  }

  const StyledWithTheme = React.forwardRef((props, ref) => {
    return (
      <StyleContext.Consumer>
        {theme => (
          <StyledCore 
            {...props} 
            __theme={theme} 
            forwardedRef={options.withRef ? ref : undefined} 
          />
        )}
      </StyleContext.Consumer>
    );
  });

  StyledWithTheme.displayName = `Styled(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return hoistStatics(StyledWithTheme, WrappedComponent);
};