/**
 * Global error handler middleware.
 * Must be registered LAST in Express — after all routes.
 */
const errorHandler = (err, req, res, next) => {
    // Log full error in development, minimal in production
    if (process.env.NODE_ENV === "development") {
        console.error("❌ Error:", err);
    } else {
        console.error(`❌ ${err.name}: ${err.message}`);
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({
            success: false,
            error: "Validation failed",
            details: errors,
        });
    }

    // Mongoose cast error (e.g. invalid ObjectId)
    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            error: `Invalid ${err.path}: ${err.value}`,
        });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(409).json({
            success: false,
            error: `Duplicate value for field: ${field}`,
        });
    }

    // Axios / AI service communication error
    if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND") {
        return res.status(503).json({
            success: false,
            error: "AI service is unavailable. Please ensure the Python service is running on port 5000.",
        });
    }

    // Default server error
    const statusCode = err.statusCode || err.status || 500;
    res.status(statusCode).json({
        success: false,
        error: err.message || "Internal server error",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};

module.exports = errorHandler;