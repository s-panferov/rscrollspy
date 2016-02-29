import * as React from 'react';
export interface ScrollSpyProps extends React.Props<ScrollSpy> {
    ids: string[];
    onChange?: (inView: string[], outView: string[]) => void;
}
export interface ScrollSpyState {
    inView?: string[];
    outView?: string[];
}
export default class ScrollSpy extends React.Component<ScrollSpyProps, ScrollSpyState> {
    static defaultProps: {
        ids: any[];
    };
    constructor(props: any);
    throttledSpy: () => void;
    targetElements: HTMLElement[];
    scrollParent: HTMLElement;
    listenerAssigned: boolean;
    ids: string;
    componentDidMount(): void;
    componentDidUpdate(prevProps: ScrollSpyProps): void;
    componentWillUnmount(): void;
    assignListener(): void;
    render(): JSX.Element;
    findTargetElements(ids: string[]): HTMLElement[];
    getScrollParent(): HTMLElement;
    getOffsetHeight(): number;
    getScrollTop(): number;
    getViewState(targetElements: HTMLElement[]): ScrollSpyState;
    isInView(el: HTMLElement): boolean;
    spy(targetElements?: HTMLElement[]): void;
}
