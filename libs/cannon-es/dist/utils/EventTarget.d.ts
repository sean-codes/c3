export declare class EventTarget {
    private _listeners;
    constructor();
    addEventListener(type: string, listener: Function): EventTarget;
    hasEventListener(type: string, listener: Function): boolean;
    hasAnyEventListener(type: string): boolean;
    removeEventListener(type: string, listener: Function): EventTarget;
    dispatchEvent(event: any): EventTarget;
}
