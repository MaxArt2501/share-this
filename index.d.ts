export type ShareThisTransformerFn = (rawText: string) => string;

export type ShareThisSharerRenderFn = (text: string, rawText: string, sahreUrl: string) => string;

export type ShareThisOpenHandler = (popover: HTMLElement, text: string, rawText: string) => void;

export type ShareThisCloseHandler = () => void;

export type ShareThisActionHandler = (event: MouseEvent, item: HTMLLIElement) => void;

export type ShareThisSharerActiveValue = (text: string, rawText: string) => any | boolean;

/**
 * Definition of the basic shape of a sharer.
 */
export interface ShareThisSharer {
    /** A unique string (among the sharers) that identifies the sharer (e.g.: `"twitter"`, `"facebook"`, ...) */
    name: string;

    /**
     * Method that gets called when a sharer must be rendered.
     * @param {string} `text`     the text that should be shared
     * @param {string} `rawText`  the original selected text content (i.e., not mangled by the `transformer`)
     * @param {string} `shareUrl` the reference URL to be shared (see the options)
     */
    render: ShareThisSharerRenderFn;

    /**
     * This property could actually be a function or a boolean, stating if the sharer is enabled (`true`) or not.
     * If it's a function, it should return a truthy or falsy value, with the same meaning.
     */
    active?: ShareThisSharerActiveValue;

    /**
     * A function to be called when the user clicks/taps on the sharing button. The `event`'s default
     * is *not* prevented. `item` is the `<li>` element that wraps the sharer's button.
     */
    action?: ShareThisActionHandler;
}

/**
 * The options for ShareThis
 */
export interface ShareThisOptions {
    /** The `Document` object to apply the sharing functionality (default: `document`); */
    document?: Document;

    /** Restricts the shared text to the contents of the elements matching `selector` (default: `"body"`) */
    selector?: string;

    /** Array of sharing channels (Twitter, Facebook, email...) */
    sharers?: ShareThisSharer[];

    /** The class name (or names) to be used in the root element of the popover (default: `share-this-popover`) */
    popoverClass?: string;

    /** Reference URL for the shared text (default: the `location` object of the `document` property) */
    shareUrl?: string;

    /** Function that transforms the extracted selected text (default: a function that trims and collapses whitespaces) */
    transformer? : ShareThisTransformerFn;

    /** Function that gets called when the sharing popover is opened */
    onOpen?: ShareThisOpenHandler;

    /** Function that gets called when the sharing popover is closed */
    onClose?: ShareThisCloseHandler;
}

/**
 * An instance of ShareThis. Before it could operate, its `init` method must be called.
 * When you don't need it to operate anymore, call its `destroy` method.
 * If some layout changes happened and the popover doesn't align with the selected text
 * anymore, use the `reposition` method.
 */
export interface ShareThisInstance {
    /**
     * Initialize the operation for the ShareThis instance.
     * @returns {boolean} `true` if the instance has been correctly initialized
     */
    init(): boolean;

    /**
     * Destroy the ShareThis instance, making it unable to operate and removing all
     * the event listeners.
     * @returns {boolean} `true` if the instance has been correctly destroyed
     */
    destroy(): boolean;

    /**
     * Reposition the popover. This method is meant to be used after a layout change.
     * @returns {boolean} `true` if there's a popover currently on screen
     */
    reposition(): boolean;
}

/**
 * Factory that produces ShareThis instances.
 */
export interface ShareThisFactory {
    (options?: ShareThisOptions): ShareThisInstance;
}

declare const ShareThis: ShareThisFactory;

export default ShareThis;
