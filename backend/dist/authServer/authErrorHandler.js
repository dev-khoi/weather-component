export const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;
    res.status(statusCode).json({
        success: false,
        msg: err.message || "Internal Server Error",
    });
};
