import 'jquery';

declare module 'jquery' {
    interface JQuery {
        summernote(options?: any): any;
    }
}