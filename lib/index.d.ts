/// <reference types="react" />
import * as React from 'react';
export interface ScrollSpyProps extends React.Props<ScrollSpy> {
    ids: string[];
    htmlProps?: React.HTMLAttributes<HTMLElement>;
    onChange?: (inView: string[], outView: string[]) => void;
}
export interface ScrollSpyState {
    inView?: string[];
    outView?: string[];
}
export default class ScrollSpy extends React.Component<ScrollSpyProps, ScrollSpyState> {
    static defaultProps: {
        ids: never[];
    };
    constructor(props: ScrollSpyProps);
    private throttledSpy;
    private targetElements;
    private scrollParent;
    private listenerAssigned;
    private ids;
    componentDidMount(): void;
    componentDidUpdate(_: ScrollSpyProps): void;
    componentWillUnmount(): void;
    assignListener(): void;
    render(): React.ReactElement<any>;
    findTargetElements(ids: string[]): HTMLElement[];
    getScrollParent(): HTMLElement;
    getOffsetHeight(): number;
    getScrollTop(): number;
    getViewState(targetElements: HTMLElement[]): ScrollSpyState;
    isInView(el: HTMLElement): boolean;
    spy(targetElements?: HTMLElement[]): void;
}
