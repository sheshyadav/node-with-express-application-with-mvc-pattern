import path from "path";


export default class GuestController {
    /**----- welcome page view -----**/
    static async welcome(request, response) {
        response.render(
            path.resolve('views/pages/welcome'), 
            {title: 'ChatNode', user:request.session.user}
        );
    }

    /**----- about page view -----**/
    static async about(request, response) {
        response.render(
            path.resolve('views/pages/about'), 
            {title: 'About', user:request.session.user}
        );
    }

    /**----- pricing page view -----**/
    static async pricing(request, response) {
        response.render(
            path.resolve('views/pages/pricing'), 
            {title: 'Pricing', user:request.session.user}
        );
    }


    /**----- 403 access denied page view -----**/
    static async pageAccessDenied(request, response) {
        response.render(
            path.resolve('views/errors/403'), 
            {title: '403'}
        );
    }


    /**----- 404 page view -----**/
    static async pageNotFound(request, response) {
        response.render(
            path.resolve('views/errors/404'), 
            {title: '404'}
        );
    }
}