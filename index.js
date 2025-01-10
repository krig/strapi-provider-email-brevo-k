"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
exports.default = {
    init: (providerOptions, settings) => {
        var _a;
        (0, node_assert_1.default)(providerOptions.apiKey, "Brevo API key is required");
        const url = (_a = providerOptions.apiUrl) !== null && _a !== void 0 ? _a : 'https://api.brevo.com/v3/smtp/email';
        return {
            send(options) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { from, to, replyTo, subject, text, html, templateId } = options, rest = __rest(options, ["from", "to", "replyTo", "subject", "text", "html", "templateId"]);
                    try {
                        if (templateId) {
                            const response = yield fetch(url, {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'API-Key': providerOptions.apiKey,
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    replyTo: {
                                        name: settings.defaultReplyToName,
                                        email: replyTo !== null && replyTo !== void 0 ? replyTo : settings.defaultReplyTo,
                                    },
                                    sender: {
                                        name: settings.defaultFromName,
                                        email: from !== null && from !== void 0 ? from : settings.defaultFrom,
                                    },
                                    to: [{ email: to }],
                                    templateId,
                                    params: rest,
                                }),
                            });
                            if (!response.ok) {
                                console.error(`Brevo mailer templateId=${templateId}: got response ${response.status}`);
                                return false;
                            }
                            return response.ok;
                        }
                        else {
                            const response = yield fetch(url, {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'API-Key': providerOptions.apiKey,
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(Object.assign({ htmlContent: html, replyTo: {
                                        name: settings.defaultReplyToName,
                                        email: replyTo !== null && replyTo !== void 0 ? replyTo : settings.defaultReplyTo,
                                    }, sender: {
                                        name: settings.defaultFromName,
                                        email: from !== null && from !== void 0 ? from : settings.defaultFrom,
                                    }, to: [{ email: to }], subject, textContent: text }, rest)),
                            });
                            if (!response.ok) {
                                console.error(`Brevo mailer: got response ${response.status}`);
                                return false;
                            }
                            return response.ok;
                        }
                    }
                    catch (err) {
                        console.error(err);
                        return false;
                    }
                });
            },
        };
    },
};
