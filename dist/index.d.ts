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
    constructor(props: any);
    throttledSpy: () => void;
    targetElements: HTMLElement[];
    scrollParent: HTMLElement;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    findTargetElements(ids: string[]): HTMLElement[];
    getScrollParent(): HTMLElement;
    getOffsetHeight(): number;
    getScrollTop(): number;
    getViewState(targetElements: HTMLElement[]): ScrollSpyState;
    isInView(el: HTMLElement): boolean;
    spy(targetElements?: HTMLElement[]): void;
}
