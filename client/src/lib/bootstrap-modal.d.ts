declare module 'bootstrap/js/dist/modal' {
  export default class Modal {
    constructor(element: Element | null, options?: any);
    show(): void;
    hide(): void;
    static getInstance(element: Element | null): Modal | null;
  }
}