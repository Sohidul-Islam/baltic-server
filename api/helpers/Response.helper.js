class ResponseHelper {
    static success(res, data, message = 'Success', status = 200) {
        return res.status(status).json({
            success: true,
            message,
            data
        });
    }

    static error(res, message = 'Error', status = 500) {
        return res.status(status).json({
            success: false,
            message
        });
    }
}

module.exports = ResponseHelper; 