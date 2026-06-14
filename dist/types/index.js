"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorType = void 0;
var ErrorType;
(function (ErrorType) {
    ErrorType["InternalError"] = "InternalError";
    ErrorType["UserAlreadyExists"] = "UserAlreadyExists";
    ErrorType["InvalidPassword"] = "InvalidPassword";
    ErrorType["UserNotFound"] = "UserNotFound";
})(ErrorType || (exports.ErrorType = ErrorType = {}));
