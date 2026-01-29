/* eslint-disable react/forbid-prop-types */
import React from "react";
import PropTypes from "prop-types";
import hoistStatics from "hoist-non-react-statics";
import * as _ from "lodash";
import normalizeStyle from "./StyleNormalizer/normalizeStyle";
import { StyleSheet } from "react-native";

import Theme, { ThemeShape } from "./Theme";
import { resolveComponentStyle } from "./resolveComponentStyle";
import { StyleContext } from "./StyleProvider";

let themeCache = {};

export function clearThemeCache() {
  themeCache = {};
}

function throwConnectStyleError(errorMessage, componentDisplayName) {
  throw Error(
    `${errorMessage} - when connecting ${componentDisplayName} component to style.`
  );
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
) => {
  function getComponentDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || "Component";
  }

  return function wrapWithStyledComponent(WrappedComponent) {
    const componentDisplayName = getComponentDisplayName(WrappedComponent);

    if (!_.isPlainObject(componentStyle)) {
      throwConnectStyleError(
        "Component style must be plain object",
        componentDisplayName
      );
    }

    if (!_.isString(componentStyleName)) {
      throwConnectStyleError(
        "Component Style Name must be string",
        componentDisplayName
      );
    }

    class StyledComponent extends React.PureComponent {
      static propTypes = {
        style: PropTypes.oneOfType([
          PropTypes.object,
          PropTypes.number,
          PropTypes.array
        ]),
        styleName: PropTypes.string,
        virtual: PropTypes.bool
      };

      static defaultProps = {
        virtual: options.virtual
      };

      static displayName = `Styled(${componentDisplayName})`;
      static WrappedComponent = WrappedComponent;

      constructor(props) {
        super(props);

        const styleNames = this.getStyleNames(props);
        const style = this.buildStyle(props, styleNames);

        this.state = {
          style,
          styleNames,
          addedProps: this.resolveAddedProps()
        };

        this.setWrappedInstance = this.setWrappedInstance.bind(this);
      }

      getTheme() {
        return (
          StyleContext._currentValue ||
          Theme.getDefaultTheme()
        );
      }

      getStyleNames(props) {
        const names = _.map(props, (value, key) => {
          if (typeof value !== "object" && value === true) {
            return "." + key;
          }
          return false;
        });

        _.remove(names, v => v === false);
        return names;
      }

      buildStyle(props, styleNames) {
        const theme = this.getTheme();

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

        themeCache[componentStyleName] = resolvedStyle;

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

      componentDidUpdate(prevProps, prevState) {
        const nextStyleNames = this.getStyleNames(this.props);

        const propsChanged =
          prevProps.style !== this.props.style ||
          prevProps.styleName !== this.props.styleName;

        const styleNamesChanged = !_.isEqual(
          prevState.styleNames,
          nextStyleNames
        );

        if (!propsChanged && !styleNamesChanged) return;

        const nextStyle = this.buildStyle(
          this.props,
          nextStyleNames
        );

        if (!_.isEqual(prevState.style, nextStyle)) {
          this.setState({
            style: nextStyle,
            styleNames: nextStyleNames
          });
        }
      }

      resolveAddedProps() {
        if (options.withRef) {
          return { ref: "wrappedInstance" };
        }
        return {};
      }

      setWrappedInstance(component) {
        this.wrappedInstance =
          component && component._root
            ? component._root
            : component;
      }

      render() {
        const { addedProps, style } = this.state;

        return (
          <WrappedComponent
            {...this.props}
            {...addedProps}
            style={style}
            ref={this.setWrappedInstance}
          />
        );
      }
    }

    return hoistStatics(StyledComponent, WrappedComponent);
  };
};