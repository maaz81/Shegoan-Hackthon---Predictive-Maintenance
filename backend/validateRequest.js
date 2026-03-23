const Joi = require("joi");

/**
 * Returns an Express middleware that validates req.body against the given Joi schema.
 * Usage: router.post("/route", validate(schema), controller)
 */
const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
        abortEarly: false,      // return all errors, not just the first
        stripUnknown: true,     // remove keys not in schema
    });

    if (error) {
        return res.status(400).json({
            success: false,
            error: "Validation failed",
            details: error.details.map((d) => d.message),
        });
    }

    req.body = value;
    next();
};

// ── Reusable schemas ──────────────────────────────────────────────────────────

const schemas = {
    // Single log entry submitted manually
    singleLog: Joi.object({
        timestamp: Joi.date().iso().default(() => new Date()),
        machine_id: Joi.number().integer().min(1).required(),
        machine_type: Joi.string()
            .valid("CNC", "Pump", "Compressor", "Robotic Arm")
            .required(),
        vibration_rms: Joi.number().min(0).max(20).default(null),
        temperature_motor: Joi.number().min(0).max(200).default(null),
        current_phase_avg: Joi.number().min(0).default(null),
        pressure_level: Joi.number().min(0).default(null),
        rpm: Joi.number().min(0).default(null),
        operating_mode: Joi.string()
            .valid("idle", "normal", "peak")
            .default("normal"),
        hours_since_maintenance: Joi.number().min(0).default(null),
        ambient_temp: Joi.number().default(null),
        rul_hours: Joi.number().min(0).default(null),
        failure_within_24h: Joi.number().valid(0, 1).default(0),
        failure_type: Joi.string()
            .valid("none", "hydraulic", "bearing", "electrical", "motor_overheat")
            .default("none"),
        estimated_repair_cost: Joi.number().min(0).default(0),
    }),

    // Analyze a single log by its MongoDB _id
    analyzeById: Joi.object({
        log_id: Joi.string().hex().length(24).required(),
    }),

    // Generate schedule
    generateSchedule: Joi.object({
        machine_ids: Joi.array().items(Joi.number().integer()).min(1).optional(),
        days_ahead: Joi.number().integer().min(1).max(90).default(7),
    }),

    // Query filters
    queryHistory: Joi.object({
        machine_id: Joi.number().integer().optional(),
        machine_type: Joi.string()
            .valid("CNC", "Pump", "Compressor", "Robotic Arm")
            .optional(),
        risk_level: Joi.string()
            .valid("Low", "Medium", "High", "Critical")
            .optional(),
        from: Joi.date().iso().optional(),
        to: Joi.date().iso().optional(),
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(20),
    }),
};

module.exports = { validate, schemas };