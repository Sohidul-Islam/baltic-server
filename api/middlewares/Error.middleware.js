
const ErrorHandler = (err, req, res, next) => {
    console.log("Middleware Error Handling");
    let errStatus = err.statusCode || 500;
    let errMsg = err.message || 'Something went wrong';

    // Check if the error is a Sequelize unique constraint error
    if (err.name === 'SequelizeUniqueConstraintError') {
        errStatus = 400; // Bad Request
        errMsg = `Duplicate entry for field: ${err.errors[0].path}. Value: ${err.errors[0].value}`;
    } else if (err.name === 'SequelizeValidationError') {
        errStatus = 400; // Bad Request
        errMsg = err.errors.map(error => error.message).join(', ');
    } else if (err.name === 'SequelizeDatabaseError') {
        errStatus = 400; // Bad Request
        errMsg = 'Database error occurred';
    } else if (err.name === 'SequelizeForeignKeyConstraintError') {
        errStatus = 400; // Bad Request
        errMsg = 'Foreign key constraint error';
    } else if (err.name === 'SequelizeConnectionError') {
        errStatus = 500; // Internal Server Error
        errMsg = 'Database connection error';
    }

    res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMsg,
        stack: process.env.NODE_ENV === 'development' ? err.stack : {},
    });
}

module.exports =  ErrorHandler