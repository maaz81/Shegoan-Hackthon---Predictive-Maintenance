const mongoose = require("mongoose");

/**
 * EquipmentLog — mirrors the CSV columns from predictive_maintenance_v3.csv
 *
 * Columns: timestamp, machine_id, machine_type, vibration_rms,
 *          temperature_motor, current_phase_avg, pressure_level, rpm,
 *          operating_mode, hours_since_maintenance, ambient_temp,
 *          rul_hours, failure_within_24h, failure_type, estimated_repair_cost
 */
const equipmentLogSchema = new mongoose.Schema(
    {
        timestamp: {
            type: Date,
            required: true,
            index: true,
        },
        machine_id: {
            type: Number,
            required: true,
            index: true,
        },
        machine_type: {
            type: String,
            required: true,
            enum: ["CNC", "Pump", "Compressor", "Robotic Arm"],
            index: true,
        },

        // ── Sensor readings ──────────────────────────────────────────
        vibration_rms: {
            type: Number,
            default: null,
        },
        temperature_motor: {
            type: Number,
            default: null,
        },
        current_phase_avg: {
            type: Number,
            default: null,
        },
        pressure_level: {
            type: Number,
            default: null,
        },
        rpm: {
            type: Number,
            default: null,
        },

        // ── Operational context ───────────────────────────────────────
        operating_mode: {
            type: String,
            enum: ["idle", "normal", "peak"],
            default: "normal",
        },
        hours_since_maintenance: {
            type: Number,
            default: null,
        },
        ambient_temp: {
            type: Number,
            default: null,
        },

        // ── Failure indicators ────────────────────────────────────────
        rul_hours: {
            type: Number,
            default: null,
            comment: "Remaining Useful Life in hours (0.5 - 98.34)",
        },
        failure_within_24h: {
            type: Number,
            enum: [0, 1],
            default: 0,
            index: true,
        },
        failure_type: {
            type: String,
            enum: ["none", "hydraulic", "bearing", "electrical", "motor_overheat"],
            default: "none",
        },
        estimated_repair_cost: {
            type: Number,
            default: 0,
        },

        // ── Optional: track which batch/upload this log came from ─────
        upload_batch_id: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,           // adds createdAt, updatedAt
        collection: "equipment_logs",
    }
);

// Compound index for common queries: get all logs for a machine sorted by time
equipmentLogSchema.index({ machine_id: 1, timestamp: -1 });

// Index for failure queries
equipmentLogSchema.index({ failure_within_24h: 1, failure_type: 1 });

// Index for risk/scheduling queries
equipmentLogSchema.index({ machine_type: 1, rul_hours: 1 });

module.exports = mongoose.model("EquipmentLog", equipmentLogSchema);