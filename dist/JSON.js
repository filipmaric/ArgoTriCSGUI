/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["JSON"] = factory();
	else
		root["JSON"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./json/index.js":
/*!***********************!*\
  !*** ./json/index.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"A_B_H_1\": () => (/* binding */ A_B_H_1),\n/* harmony export */   \"A_B_H_2\": () => (/* binding */ A_B_H_2),\n/* harmony export */   \"A_Ma_H_1\": () => (/* binding */ A_Ma_H_1),\n/* harmony export */   \"A_O_Hb_2\": () => (/* binding */ A_O_Hb_2)\n/* harmony export */ });\nconst A_B_H_1 = __webpack_require__(/*! ./A_B_H_1.json */ \"./json/A_B_H_1.json\");\nconst A_B_H_2 = __webpack_require__(/*! ./A_B_H_2.json */ \"./json/A_B_H_2.json\");\nconst A_Ma_H_1 = __webpack_require__(/*! ./A_Ma_H_1.json */ \"./json/A_Ma_H_1.json\");\nconst A_O_Hb_2 = __webpack_require__(/*! ./A_O_Hb_2.json */ \"./json/A_O_Hb_2.json\");\n\n\n//# sourceURL=webpack://ArgoTriCSGUI/./json/index.js?");

/***/ }),

/***/ "./json/A_B_H_1.json":
/*!***************************!*\
  !*** ./json/A_B_H_1.json ***!
  \***************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('[{\"type\":\"point\",\"name\":\"A\",\"construction\":\"free\",\"params\":[80,95],\"color\":\"blue\",\"intriangle\":[\"vertex\",[\"A\"]]},{\"type\":\"point\",\"name\":\"B\",\"construction\":\"free\",\"params\":[20,40],\"color\":\"blue\",\"intriangle\":[\"vertex\",[\"B\"]]},{\"type\":\"point\",\"name\":\"H\",\"construction\":\"free\",\"params\":[80,72.73],\"color\":\"blue\",\"intriangle\":[\"orthocenter\",[\"A\",\"B\",\"C\"]]},{\"type\":\"line\",\"name\":\"h_{a}\",\"construction\":\"W02\",\"params\":[\"A\",\"H\"],\"props\":[[\"not_eq_point\",\"A\",\"H\"],[\"inc\",\"A\",\"h_{a}\"],[\"inc\",\"H\",\"h_{a}\"]],\"ndg\":[],\"det\":[[\"not_eq_point\",\"A\",\"H\"]],\"lemmas\":[\"D8\",\"D3\"],\"intriangle\":[\"altitude\",[\"A\",\"B\",\"C\"]]},{\"type\":\"line\",\"name\":\"h_{b}\",\"construction\":\"W02\",\"params\":[\"B\",\"H\"],\"props\":[[\"not_eq_point\",\"B\",\"H\"],[\"inc\",\"B\",\"h_{b}\"],[\"inc\",\"H\",\"h_{b}\"]],\"ndg\":[],\"det\":[[\"not_eq_point\",\"B\",\"H\"]],\"lemmas\":[\"D9\",\"D3\"],\"intriangle\":[\"altitude\",[\"B\",\"A\",\"C\"]]},{\"type\":\"line\",\"name\":\"b\",\"construction\":\"W10a\",\"params\":[\"A\",\"h_{b}\"],\"props\":[[\"perp\",\"h_{b}\",\"b\"],[\"inc\",\"A\",\"b\"]],\"ndg\":[],\"det\":[],\"lemmas\":[\"D9\",\"GD01\"],\"intriangle\":[\"line\",[\"A\",\"C\"]]},{\"type\":\"line\",\"name\":\"a\",\"construction\":\"W10a\",\"params\":[\"B\",\"h_{a}\"],\"props\":[[\"perp\",\"h_{a}\",\"a\"],[\"inc\",\"B\",\"a\"]],\"ndg\":[],\"det\":[],\"lemmas\":[\"D8\",\"GD01\"],\"intriangle\":[\"line\",[\"B\",\"C\"]]},{\"type\":\"point\",\"name\":\"C\",\"construction\":\"W03\",\"params\":[\"b\",\"a\"],\"props\":[[\"not_eq_line\",\"b\",\"a\"],[\"inc\",\"C\",\"b\"],[\"inc\",\"C\",\"a\"]],\"ndg\":[[\"not_parallel\",\"b\",\"a\"]],\"det\":[[\"not_eq_line\",\"b\",\"a\"]],\"lemmas\":[\"GD01\"],\"intriangle\":[\"vertex\",[\"C\"]]}]');\n\n//# sourceURL=webpack://ArgoTriCSGUI/./json/A_B_H_1.json?");

/***/ }),

/***/ "./json/A_B_H_2.json":
/*!***************************!*\
  !*** ./json/A_B_H_2.json ***!
  \***************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('[{\"type\":\"point\",\"name\":\"A\",\"construction\":\"free\",\"params\":[80,95],\"color\":\"blue\",\"intriangle\":[\"vertex\",[\"A\"]]},{\"type\":\"point\",\"name\":\"B\",\"construction\":\"free\",\"params\":[20,40],\"color\":\"blue\",\"intriangle\":[\"vertex\",[\"B\"]]},{\"type\":\"point\",\"name\":\"H\",\"construction\":\"free\",\"params\":[80,72.73],\"color\":\"blue\",\"intriangle\":[\"orthocenter\",[\"A\",\"B\",\"C\"]]},{\"type\":\"point\",\"name\":\"M_{c}\",\"construction\":\"W01\",\"params\":[\"A\",\"A\",\"B\",1,2],\"props\":[[\"sratio\",\"M_{c}\",\"A\",\"B\",\"1\",\"2\"]],\"ndg\":[],\"det\":[],\"lemmas\":[\"D20\"],\"intriangle\":[\"midpoint\",[\"A\",\"B\"]]},{\"type\":\"line\",\"name\":\"h_{a}\",\"construction\":\"W02\",\"params\":[\"A\",\"H\"],\"props\":[[\"not_eq_point\",\"A\",\"H\"],[\"inc\",\"A\",\"h_{a}\"],[\"inc\",\"H\",\"h_{a}\"]],\"ndg\":[],\"det\":[[\"not_eq_point\",\"A\",\"H\"]],\"lemmas\":[\"D8\",\"D3\"],\"intriangle\":[\"altitude\",[\"A\",\"B\",\"C\"]]},{\"type\":\"line\",\"name\":\"h_{b}\",\"construction\":\"W02\",\"params\":[\"B\",\"H\"],\"props\":[[\"not_eq_point\",\"B\",\"H\"],[\"inc\",\"B\",\"h_{b}\"],[\"inc\",\"H\",\"h_{b}\"]],\"ndg\":[],\"det\":[[\"not_eq_point\",\"B\",\"H\"]],\"lemmas\":[\"D9\",\"D3\"],\"intriangle\":[\"altitude\",[\"B\",\"A\",\"C\"]]},{\"type\":\"circle\",\"name\":\"k(M_{c},A)\",\"construction\":\"W06\",\"params\":[\"A\",\"M_{c}\"],\"props\":[[\"center\",\"M_{c}\",\"k(M_{c},A)\"],[\"inc_k\",\"A\",\"k(M_{c},A)\"]],\"ndg\":[[\"not_eq_point\",\"A\",\"M_{c}\"]],\"det\":[],\"lemmas\":[\"GD02\"],\"intriangle\":[\"circle_center_through\",[\"M_{c}\",\"A\"]]},{\"type\":\"point\",\"name\":\"H_{a}\",\"construction\":\"W05\",\"params\":[\"k(M_{c},A)\",\"h_{a}\",\"M_{c}\",\"A\"],\"props\":[[\"center\",\"M_{c}\",\"k(M_{c},A)\"],[\"inc_k\",\"A\",\"k(M_{c},A)\"],[\"inc_k\",\"H_{a}\",\"k(M_{c},A)\"],[\"not_eq_point\",\"A\",\"H_{a}\"],[\"inc\",\"A\",\"h_{a}\"],[\"inc\",\"H_{a}\",\"h_{a}\"],[\"not_true\",\"inc (midpoint([a,b]),altitude(a,[b,c]))\"]],\"ndg\":[[\"intersect_line_circle\",\"h_{a}\",\"k(M_{c},A)\"]],\"det\":[[\"not_eq_point\",\"A\",\"H_{a}\"]],\"lemmas\":[\"GD02\",\"L42\",\"D8\",\"D5\"],\"intriangle\":[\"foot\",[\"A\",\"B\",\"C\"]]},{\"type\":\"line\",\"name\":\"a\",\"construction\":\"W02\",\"params\":[\"H_{a}\",\"B\"],\"props\":[[\"not_eq_point\",\"H_{a}\",\"B\"],[\"inc\",\"H_{a}\",\"a\"],[\"inc\",\"B\",\"a\"]],\"ndg\":[],\"det\":[[\"not_eq_point\",\"H_{a}\",\"B\"]],\"lemmas\":[\"D5\",\"GD01\"],\"intriangle\":[\"line\",[\"B\",\"C\"]]},{\"type\":\"point\",\"name\":\"H_{b}\",\"construction\":\"W05\",\"params\":[\"k(M_{c},A)\",\"h_{b}\",\"M_{c}\",\"B\"],\"props\":[[\"center\",\"M_{c}\",\"k(M_{c},A)\"],[\"inc_k\",\"B\",\"k(M_{c},A)\"],[\"inc_k\",\"H_{b}\",\"k(M_{c},A)\"],[\"not_eq_point\",\"B\",\"H_{b}\"],[\"inc\",\"B\",\"h_{b}\"],[\"inc\",\"H_{b}\",\"h_{b}\"],[\"not_true\",\"inc (midpoint([a,b]),altitude(b,[a,c]))\"]],\"ndg\":[[\"intersect_line_circle\",\"h_{b}\",\"k(M_{c},A)\"]],\"det\":[[\"not_eq_point\",\"B\",\"H_{b}\"]],\"lemmas\":[\"GD02\",\"L40\",\"L41\",\"D9\",\"D6\"],\"intriangle\":[\"foot\",[\"B\",\"A\",\"C\"]]},{\"type\":\"line\",\"name\":\"b\",\"construction\":\"W02\",\"params\":[\"H_{b}\",\"A\"],\"props\":[[\"not_eq_point\",\"H_{b}\",\"A\"],[\"inc\",\"H_{b}\",\"b\"],[\"inc\",\"A\",\"b\"]],\"ndg\":[],\"det\":[[\"not_eq_point\",\"H_{b}\",\"A\"]],\"lemmas\":[\"D6\",\"GD01\"],\"intriangle\":[\"line\",[\"A\",\"C\"]]},{\"type\":\"point\",\"name\":\"C\",\"construction\":\"W03\",\"params\":[\"a\",\"b\"],\"props\":[[\"not_eq_line\",\"a\",\"b\"],[\"inc\",\"C\",\"a\"],[\"inc\",\"C\",\"b\"]],\"ndg\":[[\"not_parallel\",\"a\",\"b\"]],\"det\":[[\"not_eq_line\",\"a\",\"b\"]],\"lemmas\":[\"GD01\"],\"intriangle\":[\"vertex\",[\"C\"]]}]');\n\n//# sourceURL=webpack://ArgoTriCSGUI/./json/A_B_H_2.json?");

/***/ }),

/***/ "./json/A_Ma_H_1.json":
/*!****************************!*\
  !*** ./json/A_Ma_H_1.json ***!
  \****************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('[{\"type\":\"point\",\"name\":\"A\",\"construction\":\"free\",\"params\":[80,95],\"color\":\"red\",\"intriangle\":[\"vertex\",[\"A\"]]},{\"type\":\"point\",\"name\":\"M_{a}\",\"construction\":\"free\",\"params\":[65,40],\"color\":\"red\",\"intriangle\":[\"midpoint\",[\"B\",\"C\"]]},{\"type\":\"point\",\"name\":\"H\",\"construction\":\"free\",\"params\":[80,72.73],\"color\":\"red\",\"intriangle\":[\"orthocenter\",[\"A\",\"B\",\"C\"]]},{\"type\":\"point\",\"name\":[\"sym(h)_{a}\"],\"construction\":\"W01\",\"params\":[\"M_{a}\",\"M_{a}\",\"H\",-1,1],\"props\":[[\"sratio\",\"sym(h)_{a}\",\"M_{a}\",\"H\",\"-1\",\"1\"]],\"ndg\":[],\"det\":[],\"lemmas\":[\"GL04\",\"D94\"],\"intriangle\":[\"vertex\",[\"A\"]]},{\"type\":\"point\",\"name\":[\"O\"],\"construction\":\"W01\",\"params\":[\"A\",\"A\",\"sym(h)_{a}\",1,2],\"props\":[[\"sratio\",\"O\",\"A\",\"sym(h)_{a}\",\"1\",\"2\"]],\"ndg\":[],\"det\":[],\"lemmas\":[\"GL03\",\"L126\"],\"intriangle\":[\"vertex\",[\"A\"]]},{\"type\":\"line\",\"name\":[\"h_{a}\"],\"construction\":\"W02\",\"params\":[\"A\",\"H\"],\"props\":[[\"not_eq_point\",\"A\",\"H\"],[\"inc\",\"A\",\"h_{a}\"],[\"inc\",\"H\",\"h_{a}\"]],\"ndg\":[],\"det\":[[\"not_eq_point\",\"A\",\"H\"]],\"lemmas\":[\"D8\",\"D3\"],\"intriangle\":[\"vertex\",[\"A\"]]},{\"type\":\"circle\",\"name\":[\"k(O,C)\"],\"construction\":\"W06\",\"params\":[\"A\",\"O\"],\"props\":[[\"center\",\"O\",\"k(O,C)\"],[\"inc_k\",\"A\",\"k(O,C)\"]],\"ndg\":[[\"not_eq_point\",\"A\",\"O\"]],\"det\":[],\"lemmas\":[\"D26\",\"L11\"],\"intriangle\":[\"vertex\",[\"A\"]]},{\"type\":\"line\",\"name\":[\"a\"],\"construction\":\"W10a\",\"params\":[\"M_{a}\",\"h_{a}\"],\"props\":[[\"perp\",\"h_{a}\",\"a\"],[\"inc\",\"M_{a}\",\"a\"]],\"ndg\":[],\"det\":[],\"lemmas\":[\"D8\",\"GL09\",\"D21\",\"GD01\"],\"intriangle\":[\"vertex\",[\"A\"]]},{\"type\":\"point\",\"name\":[\"C\",\"B\"],\"construction\":\"W04\",\"params\":[\"k(O,C)\",\"a\"],\"props\":[[\"inc_k\",\"C\",\"k(O,C)\"],[\"inc_k\",\"B\",\"k(O,C)\"],[\"not_eq_point\",\"C\",\"B\"],[\"inc\",\"C\",\"a\"],[\"inc\",\"B\",\"a\"]],\"ndg\":[[\"intersect_line_circle\",\"a\",\"k(O,C)\"]],\"det\":[],\"lemmas\":[\"D26\",\"L12\",\"GD01\"],\"intriangle\":[\"vertex\",[\"A\"]]}]');\n\n//# sourceURL=webpack://ArgoTriCSGUI/./json/A_Ma_H_1.json?");

/***/ }),

/***/ "./json/A_O_Hb_2.json":
/*!****************************!*\
  !*** ./json/A_O_Hb_2.json ***!
  \****************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('[{\"type\":\"point\",\"name\":\"A\",\"construction\":\"free\",\"params\":[80,95],\"color\":\"red\",\"intriangle\":[\"vertex\",[\"A\"]]},{\"type\":\"point\",\"name\":\"O\",\"construction\":\"free\",\"params\":[65,51.14],\"color\":\"red\",\"intriangle\":[\"circumcenter\",[\"A\",\"B\",\"C\"]]},{\"type\":\"point\",\"name\":\"H_{b}\",\"construction\":\"free\",\"params\":[89.36,77.83],\"color\":\"red\",\"intriangle\":[\"foot\",[\"B\",\"A\",\"C\"]]},{\"type\":\"line\",\"name\":\"b\",\"construction\":\"W02\",\"params\":[\"A\",\"H_{b}\"],\"props\":[[[\"inc\",\"H_{b}\",\"b\"],[\"D6\"]],[[\"inc\",\"A\",\"b\"],[\"GD01\"]]],\"ndg\":[],\"det\":[[\"not_eq_point\",\"A\",\"H_{b}\"]],\"lemmas\":[\"GD01\",\"D6\"],\"intriangle\":[\"line\",[\"A\",\"C\"]]},{\"type\":\"circle\",\"name\":\"k(O,C)\",\"construction\":\"W06\",\"params\":[\"A\",\"O\"],\"props\":[[[\"inc_k\",\"A\",\"k(O,C)\"],[\"L11\"]],[[\"center\",\"O\",\"k(O,C)\"],[\"D26\"]]],\"ndg\":[[\"not_eq_point\",\"A\",\"O\"]],\"det\":[],\"lemmas\":[\"D26\",\"L11\"],\"intriangle\":[\"circumcircle\",[\"A\",\"B\",\"C\"]]},{\"type\":\"point\",\"name\":\"C\",\"construction\":\"W05\",\"params\":[\"k(O,C)\",\"b\",\"O\",\"A\"],\"props\":[[[\"inc\",\"C\",\"b\"],[\"GD01\"]],[[\"inc\",\"A\",\"b\"],[\"GD01\"]],[[\"inc_k\",\"C\",\"k(O,C)\"],[\"D26\"]],[[\"inc_k\",\"A\",\"k(O,C)\"],[\"L11\"]],[[\"center\",\"O\",\"k(O,C)\"],[\"D26\"]]],\"ndg\":[[\"intersect_line_circle\",\"b\",\"k(O,C)\"]],\"det\":[[\"not_eq_point\",\"A\",\"C\"]],\"lemmas\":[\"L11\",\"D26\",\"GD01\"],\"intriangle\":[\"vertex\",[\"C\"]]},{\"type\":\"line\",\"name\":\"h_{b}\",\"construction\":\"W10b\",\"params\":[\"H_{b}\",\"b\"],\"props\":[[[\"inc\",\"H_{b}\",\"h_{b}\"],[\"D6\"]],[[\"perp\",\"h_{b}\",\"b\"],[\"D9\"]]],\"ndg\":[],\"det\":[],\"lemmas\":[\"D9\",\"D6\"],\"intriangle\":[\"altitude\",[\"B\",\"A\",\"C\"]]},{\"type\":\"point\",\"name\":[\"B_{k}\",\"B\"],\"construction\":\"W04\",\"params\":[\"k(O,C)\",\"h_{b}\"],\"props\":[[[\"inc\",\"B\",\"h_{b}\"],[\"D9\"]],[[\"inc\",\"B_{k}\",\"h_{b}\"],[\"D39\"]],[[\"inc_k\",\"B\",\"k(O,C)\"],[\"L12\"]],[[\"inc_k\",\"B_{k}\",\"k(O,C)\"],[\"D39\"]]],\"ndg\":[[\"intersect_line_circle\",\"h_{b}\",\"k(O,C)\"]],\"det\":[],\"lemmas\":[\"L12\",\"D39\",\"D9\"],\"intriangle\":[[\"altitude_circumcircle_intersect\",[\"B_{k}\"]],[\"vertex\",[\"B\"]]]}]');\n\n//# sourceURL=webpack://ArgoTriCSGUI/./json/A_O_Hb_2.json?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./json/index.js");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});