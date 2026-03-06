import { i as __toESM, t as require_react } from "./react-qyqGnMJH.js";
import { Q as defaultSxConfig, T as useDefaultProps$1, a as defaultTheme, dt as require_jsx_runtime, ft as require_prop_types, lt as isPlainObject, q as GlobalStyles$1, w as DefaultPropsProvider$1, yt as identifier_default } from "./styled-DNHFrYUb.js";

//#region node_modules/@mui/system/esm/styleFunctionSx/extendSxProp.js
var splitProps = (props) => {
	const result = {
		systemProps: {},
		otherProps: {}
	};
	const config = props?.theme?.unstable_sxConfig ?? defaultSxConfig;
	Object.keys(props).forEach((prop) => {
		if (config[prop]) result.systemProps[prop] = props[prop];
		else result.otherProps[prop] = props[prop];
	});
	return result;
};
function extendSxProp(props) {
	const { sx: inSx, ...other } = props;
	const { systemProps, otherProps } = splitProps(other);
	let finalSx;
	if (Array.isArray(inSx)) finalSx = [systemProps, ...inSx];
	else if (typeof inSx === "function") finalSx = (...args) => {
		const result = inSx(...args);
		if (!isPlainObject(result)) return systemProps;
		return {
			...systemProps,
			...result
		};
	};
	else finalSx = {
		...systemProps,
		...inSx
	};
	return {
		...otherProps,
		sx: finalSx
	};
}

//#endregion
//#region node_modules/@mui/material/esm/GlobalStyles/GlobalStyles.js
var import_prop_types = /* @__PURE__ */ __toESM(require_prop_types(), 1);
var import_jsx_runtime = require_jsx_runtime();
function GlobalStyles(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobalStyles$1, {
		...props,
		defaultTheme,
		themeId: identifier_default
	});
}
GlobalStyles.propTypes = { styles: import_prop_types.default.oneOfType([
	import_prop_types.default.array,
	import_prop_types.default.func,
	import_prop_types.default.number,
	import_prop_types.default.object,
	import_prop_types.default.string,
	import_prop_types.default.bool
]) };

//#endregion
//#region node_modules/@mui/material/esm/zero-styled/index.js
function globalCss(styles) {
	return function GlobalStylesWrapper(props) {
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobalStyles, { styles: typeof styles === "function" ? (theme) => styles({
			theme,
			...props
		}) : styles });
	};
}
function internal_createExtendSxProp() {
	return extendSxProp;
}

//#endregion
//#region node_modules/@mui/material/esm/DefaultPropsProvider/DefaultPropsProvider.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
function DefaultPropsProvider(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DefaultPropsProvider$1, { ...props });
}
DefaultPropsProvider.propTypes = {
	children: import_prop_types.default.node,
	value: import_prop_types.default.object.isRequired
};
function useDefaultProps(params) {
	return useDefaultProps$1(params);
}

//#endregion
export { extendSxProp as a, GlobalStyles as i, globalCss as n, internal_createExtendSxProp as r, useDefaultProps as t };
//# sourceMappingURL=DefaultPropsProvider-B4MSKQxN.js.map