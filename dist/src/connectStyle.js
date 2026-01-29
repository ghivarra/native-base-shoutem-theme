Object.defineProperty(exports,"__esModule",{value:true});var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _jsxFileName="src/connectStyle.js";var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();exports.













clearThemeCache=clearThemeCache;var _react=require("react");var _react2=_interopRequireDefault(_react);var _propTypes=require("prop-types");var _propTypes2=_interopRequireDefault(_propTypes);var _hoistNonReactStatics=require("hoist-non-react-statics");var _hoistNonReactStatics2=_interopRequireDefault(_hoistNonReactStatics);var _lodash=require("lodash");var _=_interopRequireWildcard(_lodash);var _normalizeStyle=require("./StyleNormalizer/normalizeStyle");var _normalizeStyle2=_interopRequireDefault(_normalizeStyle);var _reactNative=require("react-native");var _Theme=require("./Theme");var _Theme2=_interopRequireDefault(_Theme);var _resolveComponentStyle=require("./resolveComponentStyle");var _StyleProviderContext=require("./StyleProviderContext");function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj;}else{var newObj={};if(obj!=null){for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key))newObj[key]=obj[key];}}newObj.default=obj;return newObj;}}function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _toConsumableArray(arr){if(Array.isArray(arr)){for(var i=0,arr2=Array(arr.length);i<arr.length;i++){arr2[i]=arr[i];}return arr2;}else{return Array.from(arr);}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var themeCache={};function clearThemeCache(){
themeCache={};
}

function throwConnectStyleError(errorMessage,componentDisplayName){
throw Error(
errorMessage+" - when connecting "+componentDisplayName+" component to style.");

}

function isStyleVariant(propertyName){
return /^\./.test(propertyName);
}

function isChildStyle(propertyName){
return /(^[^\.].*\.)|^\*$/.test(propertyName);
}

function getConcreteStyle(style){
return _.pickBy(style,function(value,key){
return!isStyleVariant(key)&&!isChildStyle(key);
});
}exports.default=

function(
componentStyleName)



{var componentStyle=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};var mapPropsToStyleNames=arguments[2];var options=arguments.length>3&&arguments[3]!==undefined?arguments[3]:{};
function getComponentDisplayName(WrappedComponent){
return WrappedComponent.displayName||WrappedComponent.name||"Component";
}

return function wrapWithStyledComponent(WrappedComponent){
var componentDisplayName=getComponentDisplayName(WrappedComponent);

if(!_.isPlainObject(componentStyle)){
throwConnectStyleError(
"Component style must be plain object",
componentDisplayName);

}

if(!_.isString(componentStyleName)){
throwConnectStyleError(
"Component Style Name must be string",
componentDisplayName);

}var

StyledComponent=function(_React$PureComponent){_inherits(StyledComponent,_React$PureComponent);

















function StyledComponent(props){_classCallCheck(this,StyledComponent);var _this=_possibleConstructorReturn(this,(StyledComponent.__proto__||Object.getPrototypeOf(StyledComponent)).call(this,
props));

var styleNames=_this.getStyleNames(props);
var style=_this.buildStyle(props,styleNames);

_this.state={
style:style,
styleNames:styleNames,
addedProps:_this.resolveAddedProps()};


_this.setWrappedInstance=_this.setWrappedInstance.bind(_this);return _this;
}_createClass(StyledComponent,[{key:"getTheme",value:function getTheme()

{
return(
_StyleProviderContext.StyleContext._currentValue||
_Theme2.default.getDefaultTheme());

}},{key:"getStyleNames",value:function getStyleNames(

props){
var names=_.map(props,function(value,key){
if(typeof value!=="object"&&value===true){
return"."+key;
}
return false;
});

_.remove(names,function(v){return v===false;});
return names;
}},{key:"buildStyle",value:function buildStyle(

props,styleNames){
var theme=this.getTheme();

var themeStyle=theme.createComponentStyle(
componentStyleName,
componentStyle);


var resolvedStyle=(0,_resolveComponentStyle.resolveComponentStyle)(
componentStyleName,
styleNames,
themeStyle,
{});


themeCache[componentStyleName]=resolvedStyle;

var concreteStyle=getConcreteStyle(
_.merge({},resolvedStyle));


if(_.isArray(props.style)){
return[concreteStyle].concat(_toConsumableArray(props.style));
}

if(
typeof props.style==="number"||
typeof props.style==="object")
{
return[concreteStyle,props.style];
}

return concreteStyle;
}},{key:"componentDidUpdate",value:function componentDidUpdate(

prevProps,prevState){
var nextStyleNames=this.getStyleNames(this.props);

var propsChanged=
prevProps.style!==this.props.style||
prevProps.styleName!==this.props.styleName;

var styleNamesChanged=!_.isEqual(
prevState.styleNames,
nextStyleNames);


if(!propsChanged&&!styleNamesChanged)return;

var nextStyle=this.buildStyle(
this.props,
nextStyleNames);


if(!_.isEqual(prevState.style,nextStyle)){
this.setState({
style:nextStyle,
styleNames:nextStyleNames});

}
}},{key:"resolveAddedProps",value:function resolveAddedProps()

{
if(options.withRef){
return{ref:"wrappedInstance"};
}
return{};
}},{key:"setWrappedInstance",value:function setWrappedInstance(

component){
this.wrappedInstance=
component&&component._root?
component._root:
component;
}},{key:"render",value:function render()

{var _state=
this.state,addedProps=_state.addedProps,style=_state.style;

return(
_react2.default.createElement(WrappedComponent,_extends({},
this.props,
addedProps,{
style:style,
ref:this.setWrappedInstance,__source:{fileName:_jsxFileName,lineNumber:198}})));


}}]);return StyledComponent;}(_react2.default.PureComponent);StyledComponent.propTypes={style:_propTypes2.default.oneOfType([_propTypes2.default.object,_propTypes2.default.number,_propTypes2.default.array]),styleName:_propTypes2.default.string,virtual:_propTypes2.default.bool};StyledComponent.defaultProps={virtual:options.virtual};StyledComponent.displayName="Styled("+componentDisplayName+")";StyledComponent.WrappedComponent=WrappedComponent;


return(0,_hoistNonReactStatics2.default)(StyledComponent,WrappedComponent);
};
};
//# sourceMappingURL=connectStyle.js.map