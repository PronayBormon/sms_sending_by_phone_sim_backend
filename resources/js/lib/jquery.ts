import jQuery from 'jquery';

declare global {
    interface Window {
        $: typeof jQuery;
        jQuery: typeof jQuery;
    }
}

window.$ = jQuery;
window.jQuery = jQuery;

export default jQuery;