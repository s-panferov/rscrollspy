import * as React from 'react';

export interface ScrollSpyProps extends React.Props<ScrollSpy> {
    ids: string[];
    htmlProps?: React.HTMLAttributes;
    onChange?: (inView: string[], outView: string[]) => void;
}

export interface ScrollSpyState {
    inView?: string[];
    outView?: string[];
}

export default class ScrollSpy extends React.Component<ScrollSpyProps, ScrollSpyState> {
    static defaultProps = {
        ids: []
    };

    constructor(props) {
        super(props);
        this.state = {
            inView: [],
            outView: []
        };

        this.throttledSpy = throttle(this.spy.bind(this), 25);
    }

    throttledSpy: () => void;
    targetElements: HTMLElement[];
    scrollParent: HTMLElement;
    listenerAssigned: boolean;

    ids: string;

    componentDidMount() {
        const targetItems = this.findTargetElements(this.props.ids);
        this.targetElements = targetItems;
        this.spy(targetItems);
        this.ids = this.props.ids.join('/');

        this.assignListener();
    }

    componentDidUpdate(prevProps: ScrollSpyProps) {
        let nextIdx = (this.props.ids || []).join('/');
        if (nextIdx !== this.ids) {
            this.ids = nextIdx;
            this.targetElements = this.findTargetElements(this.props.ids);
            this.spy(this.targetElements);

            if (!this.listenerAssigned) {
                this.assignListener();
            }
        }
    }

    componentWillUnmount() {
        let scrollParent = this.getScrollParent();
        if (scrollParent) {
            if (scrollParent == document.body) {
                scrollParent = window as any;
            }
            scrollParent.removeEventListener('scroll', this.throttledSpy);
        }
    }

    assignListener() {
        let scrollParent = this.getScrollParent();
        if (scrollParent) {
            if (scrollParent == document.body) {
                scrollParent = window as any;
            }
            this.listenerAssigned = true;
            scrollParent.addEventListener('scroll', this.throttledSpy);
        }
    }

    render() {
        let renderer: (inView: string[], outView: string[]) => React.ReactElement<any> = this.props.children as any;
        return (
            renderer(this.state.inView, this.state.outView)
        );
    }

    findTargetElements(ids: string[]): HTMLElement[] {
        const targetItems = ids
            .map((id) => {
                return document.getElementById(id);
            })
            .filter(Boolean);

        return targetItems;
    }

    getScrollParent() {
        if (this.scrollParent) {
            return this.scrollParent;
        } else {
            let firstEl = this.targetElements[0];
            if (firstEl) {
                return this.scrollParent = getScrollParent(
                    firstEl
                );
            }
        }
    }

    getOffsetHeight(): number {
        return this.getScrollParent().offsetHeight;
    }

    getScrollTop(): number {
        return this.getScrollParent().scrollTop;
    }

    getViewState(targetElements: HTMLElement[]): ScrollSpyState {
        let inView: string[] = [];
        let outView: string[] = [];

        let hasInViewAlready = false;
        for (let i = 0, max = targetElements.length; i < max; i++) {
            let element = targetElements[i];
            let isInView = hasInViewAlready ? false : this.isInView(element);

            if (isInView) {
                hasInViewAlready = true;
                inView.push(element.id);
            } else {
                outView.push(element.id);
            }
        }

        return {
            inView,
            outView
        };
    }

    isInView(el: HTMLElement) {
        const height = this.getOffsetHeight();
        const scrollTop = this.getScrollTop();
        const scrollBottom = scrollTop + height;

        const elTop = el.offsetTop;
        const elBottom = elTop + el.offsetHeight;

        return (elTop < scrollBottom) && (elBottom > scrollTop);
    }

    spy(targetElements?: HTMLElement[]) {
        let finalTargets = targetElements || this.targetElements;
        let newState = this.getViewState(finalTargets);
        // TODO @spanferov not so stupid equal check
        if (newState.inView.join('/') !== this.state.inView.join('/')) {
            this.setState(newState);
            if (this.props.onChange) {
                this.props.onChange(newState.inView, newState.outView);
            }
        }
    }
}

function getScrollParent(el: HTMLElement): HTMLElement {
    // In firefox if the el is inside an iframe with display: none; window.getComputedStyle() will return null;
    // https://bugzilla.mozilla.org/show_bug.cgi?id=548397
    const computedStyle: any = getComputedStyle(el) || {};
    const position = computedStyle.position;

    if (position === 'fixed') {
        return el;
    }

    let parent: any = el;
    while (parent = parent.parentNode) {
        if (parent === document.body) {
            break;
        }

        let style;
        try {
            style = getComputedStyle(parent);
        } catch (err) { }

        if (typeof style === 'undefined' || style === null) {
            return parent;
        }

        const {overflow, overflowX, overflowY} = style;
        if (/(auto|scroll)/.test(overflow + overflowY + overflowX)) {
            if (position !== 'absolute' || ['relative', 'absolute', 'fixed'].indexOf(style.position) >= 0) {
                return parent;
            }
        }
    }

    return document.body;
}

function throttle(callback, limit) {
    let wait = false;
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
