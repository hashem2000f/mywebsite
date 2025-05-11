declare module 'bootstrap' {
  export class Modal {
    constructor(element: Element | null);
    show(): void;
    hide(): void;
    static getInstance(element: Element | null): Modal | null;
  }
}