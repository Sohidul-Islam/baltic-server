const ErrorMiddleware = (err, req, res, next) => {
    console.error('Error:', err);

    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.status(status).json({
        success: false,
        status,
        message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : {}
    });
};

module.exports = ErrorMiddleware;