

// Catch Async
/**
 * Utility to catch errors in async route handlers and pass them to Express error middleware.
 * This prevents having to use try/catch in every controller.
 * 
 * @param {Function} fn - An async Express route handler or middleware
 */


const catchAsync = (fn) => {
    return ( req, res, next) => {
        Promise.resolve( fn (req, res, next)).catch(next)
    }
}



export default catchAsync
