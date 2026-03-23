const mongoose = require("mongoose");

/**
 * MaintenanceSchedule — stores AI-generated prioritized maintenance plans.
 * One document = one scheduled maintenance task for one machine.
 */
const maintenanceScheduleSchema = new mongoose.Schema(
    {
        machine_id: {
            type: Number,
            required: true,
            index: true,
        },
        machine_type: {
            type: String,
            required: true,
        },

        // ── Scheduling details ────────────────────────────────────────
        priority: {
            type: String,
            enum: ["P1_Critical", "P2_High", "P3_Medium", "P4_Low"],
            required: true,
            index: true,
        },
        priority_score: {
            type: Number,
            min: 0,
            max: 100,
            default: null,
            comment: "Numeric priority score used for sorting",
        },
        scheduled_date: {
            type: Date,
            required: true,
            index: true,
        },
        estimated_duration_hours: {
            type: Number,
            default: null,
        },

        // ── What needs to be done ─────────────────────────────────────
        maintenance_type: {
            type: String,
            enum: ["preventive", "corrective", "predictive", "emergency"],
            default: "predictive",
        },
        tasks: [
            {
                type: String,
            },
        ],
        failure_risk: {
            type: String,
            enum: ["none", "hydraulic", "bearing", "electrical", "motor_overheat", "unknown"],
            default: "unknown",
        },

        // ── AI-generated explanation ──────────────────────────────────
        explanation: {
            type: String,
            required: true,
            comment: "AI-generated human-readable explanation of why this is scheduled",
        },
        estimated_cost: {
            type: Number,
            default: null,
        },

        // ── Status tracking ───────────────────────────────────────────
        status: {
            type: String,
            enum: ["pending", "in_progress", "completed", "cancelled"],
            default: "pending",
            index: true,
        },
        completed_at: {
            type: Date,
            default: null,
        },
        notes: {
            type: String,
            default: null,
        },

        // ── Link back to the analysis that triggered this schedule ────
        analysis_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AnalysisResult",
            default: null,
        },

        // ── AI provider that generated this schedule ──────────────────
        generated_by: {
            type: String,
            enum: ["claude", "openai", "rule_based"],
            default: "claude",
        },
    },
    {
        timestamps: true,
        collection: "maintenance_schedules",
    }
);

// Compound index: upcoming schedules by priority
maintenanceScheduleSchema.index({ status: 1, scheduled_date: 1, priority: 1 });

// Index: all schedules for a machine
maintenanceScheduleSchema.index({ machine_id: 1, scheduled_date: -1 });

module.exports = mongoose.model("MaintenanceSchedule", maintenanceScheduleSchema);