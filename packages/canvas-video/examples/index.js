
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':3001/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function () {
    'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (g && (g = 0, op[0] && (_ = 0)), _) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    var CanvasVideoCanvas = /** @class */ (function () {
        function CanvasVideoCanvas(_player, _viewport, _renderer) {
            var _this = this;
            this._player = _player;
            this._viewport = _viewport;
            this._renderer = _renderer;
            this._handleTick = function (player) {
                _this._renderer(_this._renderingContext, player.state);
            };
            this._element = this._createElement();
            var renderingContext = this._element.getContext('2d');
            if (renderingContext) {
                this._renderingContext = renderingContext;
            }
            else {
                throw new Error('canvas context not usable');
            }
            this._player.on('tick', this._handleTick);
        }
        Object.defineProperty(CanvasVideoCanvas.prototype, "element", {
            get: function () {
                return this._element;
            },
            enumerable: false,
            configurable: true
        });
        CanvasVideoCanvas.prototype.destroy = function () {
            this._player.off('tick', this._handleTick);
        };
        CanvasVideoCanvas.prototype._createElement = function () {
            var element = document.createElement('canvas');
            element.width = this._viewport.width;
            element.height = this._viewport.height;
            element.style.setProperty('display', 'none');
            return element;
        };
        return CanvasVideoCanvas;
    }());

    var r=function(){function r(){this._registry={};}return r.prototype.on=function(r,t,e){var i=this;switch(typeof r){case"string":if(!t)throw new Error("[@anylab/canvas-video] argument eventHandler required!");var n=r,s=t;this._registry[n]=this._registry[n]||[],this._registry[n].push({life:null!=e?e:-1,handler:s});break;case"object":if(!r)throw new Error("[@anylab/canvas-video] argument eventSpecification required!");var h=r;Object.entries(h).forEach((function(r){var t=r[0],e=r[1];i.on(t,e);}));}return this},r.prototype.once=function(r,t){var e=this;switch(typeof r){case"string":if(!t)throw new Error("[@anylab/canvas-video] argument eventHandler required!");var i=r,n=t;this.on(i,n,1);break;case"object":var s=r;Object.entries(s).forEach((function(r){var t=r[0],i=r[1];e.on(t,i,1);}));}return this},r.prototype.off=function(r,t){if(!r)return this._registry={},this;if("string"==typeof r){var e=r;if(t){if(this._registry[e]){var i=(this._registry[e]||[]).findIndex((function(r){return r.handler===t}));i>=0&&(1===this._registry[e].length?delete this._registry[e]:this._registry[e].splice(i,1));}}else delete this._registry[e];}return this},r.prototype.emit=function(r,t){for(var e=[],i=this._registry[r]||[],n=0;n<i.length;n++){var s=i[n];s.life>0&&s.life--,s.handler(t),0!==s.life&&e.push(s);}e.length>0?this._registry[r]=e:delete this._registry[r];},r.prototype.has=function(r,t){if(!r)return Object.keys(this._registry).length>0;var e=r,i=!!this._registry[e]&&this._registry[e].length>0;return t?!!i&&this._registry[e].findIndex((function(r){return r.handler===t}))>=0:i},r}();

    var CanvasVideoPlayer = /** @class */ (function (_super) {
        __extends(CanvasVideoPlayer, _super);
        function CanvasVideoPlayer(opt) {
            var _a, _b;
            var _this = _super.call(this) || this;
            _this._startTimestamp = null;
            _this._animationFrameId = null;
            _this._state = {
                sequence: 0,
                time: 0,
                percent: 0,
                isPlaying: false,
            };
            _this._next = function (timestamp) {
                if (!_this._state.isPlaying) {
                    return;
                }
                var startTimestamp = _this._startTimestamp;
                var hit = false;
                if (startTimestamp === null) {
                    _this._startTimestamp = timestamp;
                    _this._state.time = 0;
                    _this._state.percent = 0;
                    hit = true;
                }
                else {
                    _this._state.time = timestamp - startTimestamp;
                    _this._state.percent = _this._totalTime > 0 ? _this._state.time / _this._totalTime : 0;
                    hit = _this._state.time >= _this._getNextTime();
                }
                if (hit) {
                    _this.emit('tick', _this);
                    _this._state.sequence++;
                }
                _this._animationFrameId = requestAnimationFrame(_this._next);
            };
            _this._totalTime = (_a = opt === null || opt === void 0 ? void 0 : opt.totalTime) !== null && _a !== void 0 ? _a : 0;
            _this._frameRate = (_b = opt === null || opt === void 0 ? void 0 : opt.frameRate) !== null && _b !== void 0 ? _b : 60;
            return _this;
        }
        Object.defineProperty(CanvasVideoPlayer.prototype, "frameRate", {
            get: function () {
                return this._frameRate;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CanvasVideoPlayer.prototype, "state", {
            get: function () {
                return this._state;
            },
            enumerable: false,
            configurable: true
        });
        CanvasVideoPlayer.prototype.play = function () {
            this._state.isPlaying = true;
            this.emit('play');
            this._animationFrameId = requestAnimationFrame(this._next);
        };
        CanvasVideoPlayer.prototype.stop = function () {
            this._state = {
                sequence: 0,
                time: 0,
                percent: 0,
                isPlaying: false,
            };
            if (this._animationFrameId !== null) {
                cancelAnimationFrame(this._animationFrameId);
                this._animationFrameId = null;
            }
        };
        CanvasVideoPlayer.prototype._getNextTime = function () {
            var nextSequence = this._state.sequence;
            var timeUnit = 1000 / this._frameRate;
            return timeUnit * nextSequence;
        };
        return CanvasVideoPlayer;
    }(r));

    var CanvasVideoVideo = /** @class */ (function () {
        function CanvasVideoVideo(_player, _viewport, opt) {
            var _this = this;
            this._player = _player;
            this._viewport = _viewport;
            this._handlePlay = function () {
                _this._element.play();
            };
            this._element = this._createElement(opt);
            this._player.on('play', this._handlePlay);
        }
        Object.defineProperty(CanvasVideoVideo.prototype, "element", {
            get: function () {
                return this._element;
            },
            enumerable: false,
            configurable: true
        });
        CanvasVideoVideo.prototype._createElement = function (opt) {
            var element = document.createElement('video');
            element.width = this._viewport.width;
            element.height = this._viewport.height;
            if (opt === null || opt === void 0 ? void 0 : opt.className) {
                element.classList.add(opt.className);
            }
            if (opt === null || opt === void 0 ? void 0 : opt.inlineStyles) {
                Object.entries(opt.inlineStyles).forEach(function (_a) {
                    var property = _a[0], value = _a[1];
                    element.style.setProperty(property, value.toString());
                });
            }
            return element;
        };
        return CanvasVideoVideo;
    }());

    var CanvasVideo = /** @class */ (function () {
        function CanvasVideo(opt) {
            var viewport = this._createViewport(opt);
            this._player = new CanvasVideoPlayer(opt);
            this._video = new CanvasVideoVideo(this._player, viewport, opt);
            this._canvas = new CanvasVideoCanvas(this._player, viewport, opt.render);
            this._fragment = this._connectAndCreateFragment();
        }
        CanvasVideo.prototype.insertUnder = function (element) {
            element.appendChild(this._fragment);
            return this;
        };
        CanvasVideo.prototype.play = function () {
            this._player.play();
            return this;
        };
        CanvasVideo.prototype._createViewport = function (opt) {
            var _a;
            var widthInfo = opt.width;
            var heightInfo = opt.height;
            var ratio = (_a = opt.ratio) !== null && _a !== void 0 ? _a : 1;
            if (widthInfo && heightInfo) {
                return {
                    ratio: ratio,
                    width: widthInfo,
                    height: heightInfo,
                };
            }
            else if (widthInfo) {
                return {
                    ratio: ratio,
                    width: widthInfo,
                    height: widthInfo / ratio,
                };
            }
            else if (heightInfo) {
                return {
                    ratio: ratio,
                    width: ratio * heightInfo,
                    height: heightInfo,
                };
            }
            return {
                ratio: ratio,
                width: 200,
                height: 200 / ratio,
            };
        };
        CanvasVideo.prototype._connectAndCreateFragment = function () {
            var videoElement = this._video.element;
            var canvasElement = this._canvas.element;
            var fragment = document.createDocumentFragment();
            videoElement.srcObject = canvasElement.captureStream(this._player.frameRate);
            fragment.appendChild(videoElement);
            fragment.appendChild(canvasElement);
            return fragment;
        };
        return CanvasVideo;
    }());

    function main() {
        return __awaiter(this, void 0, void 0, function () {
            var TEN_MINUTES, canvasWidth, canvasHeight, canvasVideo;
            return __generator(this, function (_a) {
                TEN_MINUTES = 1000 * 60 * 10;
                canvasWidth = 300;
                canvasHeight = 200;
                canvasVideo = new CanvasVideo({
                    totalTime: TEN_MINUTES,
                    frameRate: 60,
                    width: canvasWidth,
                    height: canvasHeight,
                    className: '_video',
                    render: function (ctx, _a) {
                        var sequence = _a.sequence;
                        ctx.setTransform(1, 0, 0, 1, 0, 0);
                        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                        ctx.translate(canvasWidth / 2, canvasHeight / 2);
                        ctx.rotate(0.04 * sequence);
                        ctx.translate(0, 0);
                        ctx.fillStyle = '#000000';
                        ctx.fillRect(-50, -50, 100, 100);
                    },
                });
                canvasVideo.insertUnder(document.getElementById('base_example'));
                document.querySelector('._btnPlay').addEventListener('click', function () {
                    canvasVideo.play();
                });
                document.querySelector('#base_desc').innerText =
                    'The above element is not a <canvas>, The <video>.\nclick Play button!';
                return [2 /*return*/];
            });
        });
    }
    main();

})();
