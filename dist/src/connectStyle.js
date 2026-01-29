Object.defineProperty(exports,"__esModule",{value:true});var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _jsxFileName="src/connectStyle.js";var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();exports.










clearThemeCache=clearThemeCache;var _react=require("react");var _react2=_interopRequireDefault(_react);var _propTypes=require("prop-types");var _propTypes2=_interopRequireDefault(_propTypes);var _hoistNonReactStatics=require("hoist-non-react-statics");var _hoistNonReactStatics2=_interopRequireDefault(_hoistNonReactStatics);var _lodash=require("lodash");var _=_interopRequireWildcard(_lodash);var _Theme=require("./Theme");var _Theme2=_interopRequireDefault(_Theme);var _resolveComponentStyle=require("./resolveComponentStyle");var _StyleProviderContext=require("./StyleProviderContext");function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj;}else{var newObj={};if(obj!=null){for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key))newObj[key]=obj[key];}}newObj.default=obj;return newObj;}}function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _objectWithoutProperties(obj,keys){var target={};for(var i in obj){if(keys.indexOf(i)>=0)continue;if(!Object.prototype.hasOwnProperty.call(obj,i))continue;target[i]=obj[i];}return target;}function _toConsumableArray(arr){if(Array.isArray(arr)){for(var i=0,arr2=Array(arr.length);i<arr.length;i++){arr2[i]=arr[i];}return arr2;}else{return Array.from(arr);}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var themeCache={};function clearThemeCache(){
themeCache={};
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
componentStyleName){var
componentStyle=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};var
mapPropsToStyleNames=arguments[2];var
options=arguments.length>3&&arguments[3]!==undefined?arguments[3]:{};return(
function(WrappedComponent){var
StyledCore=function(_React$PureComponent){_inherits(StyledCore,_React$PureComponent);
















function StyledCore(props){_classCallCheck(this,StyledCore);var _this=_possibleConstructorReturn(this,(StyledCore.__proto__||Object.getPrototypeOf(StyledCore)).call(this,
props));
var styleNames=_this.getStyleNames(props);
var style=_this.buildStyle(props,styleNames);

_this.state={
style:style,
styleNames:styleNames};return _this;

}_createClass(StyledCore,[{key:"getStyleNames",value:function getStyleNames(

props){
var names=_.map(props,function(value,key){return(
typeof value!=="object"&&value===true?"."+key:false);});

_.remove(names,function(v){return v===false;});
return names;
}},{key:"buildStyle",value:function buildStyle(

props,styleNames){
var theme=props.__theme||_Theme2.default.getDefaultTheme();

var themeStyle=theme.createComponentStyle(
componentStyleName,
componentStyle);


var resolvedStyle=(0,_resolveComponentStyle.resolveComponentStyle)(
componentStyleName,
styleNames,
themeStyle,
{});


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

prevProps){
var nextStyleNames=this.getStyleNames(this.props);

if(
prevProps.__theme!==this.props.__theme||
prevProps.style!==this.props.style||
!_.isEqual(this.state.styleNames,nextStyleNames))
{
var style=this.buildStyle(this.props,nextStyleNames);
this.setState({style:style,styleNames:nextStyleNames});
}
}},{key:"render",value:function render()

{var _props=
this.props,style=_props.style,__theme=_props.__theme,forwardedRef=_props.forwardedRef,rest=_objectWithoutProperties(_props,["style","__theme","forwardedRef"]);

var refSent=options.withRef&&(typeof forwardedRef==='function'||typeof forwardedRef==='object')?forwardedRef:null;

return(
_react2.default.createElement(WrappedComponent,_extends({},
rest,{
style:this.state.style,
ref:refSent,__source:{fileName:_jsxFileName,lineNumber:124}})));


}}]);return StyledCore;}(_react2.default.PureComponent);StyledCore.propTypes={style:_propTypes2.default.oneOfType([_propTypes2.default.object,_propTypes2.default.number,_propTypes2.default.array]),styleName:_propTypes2.default.string,virtual:_propTypes2.default.bool,__theme:_propTypes2.default.object,forwardedRef:_propTypes2.default.any};StyledCore.defaultProps={virtual:options.virtual};


var StyledWithTheme=_react2.default.forwardRef(function(props,ref){
return(
_react2.default.createElement(_StyleProviderContext.StyleContext.Consumer,{__source:{fileName:_jsxFileName,lineNumber:135}},
function(theme){return(
_react2.default.createElement(StyledCore,_extends({},
props,{
__theme:theme,
forwardedRef:ref,__source:{fileName:_jsxFileName,lineNumber:137}})));}));




});

StyledWithTheme.displayName="Styled("+(
WrappedComponent.displayName||WrappedComponent.name||"Component")+")";


return(0,_hoistNonReactStatics2.default)(StyledWithTheme,WrappedComponent);
});};
//# sourceMappingURL=connectStyle.js.map