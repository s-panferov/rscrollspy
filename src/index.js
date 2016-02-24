"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var ScrollSpy = (function (_super) {
    __extends(ScrollSpy, _super);
    function ScrollSpy(props) {
        _super.call(this, props);
        this.state = {
            inView: [],
            outView: []
        };
        this.throttledSpy = throttle(this.spy.bind(this), 25);
    }
    ScrollSpy.prototype.componentDidMount = function () {
        var targetItems = this.findTargetElements(this.props.ids);
        this.targetElements = targetItems;
        this.spy(targetItems);
        var scrollParent = this.getScrollParent();
        if (scrollParent) {
            if (scrollParent == document.body) {
                scrollParent = window;
            }
            scrollParent.addEventListener('scroll', this.throttledSpy);
        }
    };
    ScrollSpy.prototype.componentWillUnmount = function () {
        var scrollParent = this.getScrollParent();
        if (scrollParent) {
            if (scrollParent == document.body) {
                scrollParent = window;
            }
            scrollParent.removeEventListener('scroll', this.throttledSpy);
        }
    };
    ScrollSpy.prototype.render = function () {
        var renderer = this.props.children;
        return (React.createElement("div", null, renderer(this.state.inView, this.state.outView)));
    };
    ScrollSpy.prototype.findTargetElements = function (ids) {
        var targetItems = ids
            .map(function (id) {
            return document.getElementById(id);
        })
            .filter(Boolean);
        console.log(targetItems);
        return targetItems;
    };
    ScrollSpy.prototype.getScrollParent = function () {
        if (this.scrollParent) {
            return this.scrollParent;
        }
        else {
            var firstEl = this.targetElements[0];
            if (firstEl) {
                return this.scrollParent = getScrollParent(firstEl);
            }
        }
    };
    ScrollSpy.prototype.getOffsetHeight = function () {
        return this.getScrollParent().offsetHeight;
    };
    ScrollSpy.prototype.getScrollTop = function () {
        return this.getScrollParent().scrollTop;
    };
    ScrollSpy.prototype.getViewState = function (targetElements) {
        var inView = [];
        var outView = [];
        var hasInViewAlready = false;
        for (var i = 0, max = targetElements.length; i < max; i++) {
            var element = targetElements[i];
            var isInView = hasInViewAlready ? false : this.isInView(element);
            if (isInView) {
                hasInViewAlready = true;
                inView.push(element.id);
            }
            else {
                outView.push(element.id);
            }
        }
        return {
            inView: inView,
            outView: outView
        };
    };
    ScrollSpy.prototype.isInView = function (el) {
        var height = this.getOffsetHeight();
        var scrollTop = this.getScrollTop();
        var scrollBottom = scrollTop + height;
        var elTop = el.offsetTop;
        var elBottom = elTop + el.offsetHeight;
        return (elTop < scrollBottom) && (elBottom > scrollTop);
    };
    ScrollSpy.prototype.spy = function (targetElements) {
        var finalTargets = targetElements || this.targetElements;
        var newState = this.getViewState(finalTargets);
        if (newState.inView.join('/') !== this.state.inView.join('/')) {
            this.setState(newState);
            if (this.props.onChange) {
                this.props.onChange(newState.inView, newState.outView);
            }
        }
    };
    return ScrollSpy;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ScrollSpy;
function getScrollParent(el) {
    var computedStyle = getComputedStyle(el) || {};
    var position = computedStyle.position;
    if (position === 'fixed') {
        return el;
    }
    var parent = el;
    while (parent = parent.parentNode) {
        if (parent === document.body) {
            break;
        }
        var style = void 0;
        try {
            style = getComputedStyle(parent);
        }
        catch (err) { }
        if (typeof style === 'undefined' || style === null) {
            return parent;
        }
        var overflow = style.overflow, overflowX = style.overflowX, overflowY = style.overflowY;
        if (/(auto|scroll)/.test(overflow + overflowY + overflowX)) {
            if (position !== 'absolute' || ['relative', 'absolute', 'fixed'].indexOf(style.position) >= 0) {
                return parent;
            }
        }
    }
    return document.body;
}
function throttle(callback, limit) {
    var wait = false;
    return function () {
        if (!wait) {
            callback.call();
            wait = true;
            setTimeout(function () {
                wait = false;
            }, limit);
        }
    };
}
