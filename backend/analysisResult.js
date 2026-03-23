const mongoose = require("mongoose");

/**
 * AnalysisResult — stores the AI analysis output for a given equipment log
 * Each document links back to an EquipmentLog and holds the AI's verdict.
 */
const analysisResultSchema = new mongoose.Schema(
    {
        // Reference to the raw log entry that was analyzed
        log_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "EquipmentLog",
            required: true,
            index: true,
        },

        // Denormalized for fast queries without population
        machine_id: {
            type: Number,
            required: true,
            index: true,
        },
        machine_type: {
            type: String,
            required: true,
        },
        timestamp: {
            type: Date,
            required: true,
        },

        // ── AI output ─────────────────────────────────────────────────
        risk_level: {
            type: String,
            enum: ["Low", "Medium", "High", "Critical"],
            required: true,
            index: true,
        },
        risk_score: {
            type: Number,
            min: 0,
            max: 100,
            default: null,
            comment: "Numeric score 0–100 if AI returns one",
        },
        reason: {
            type: String,
            required: true,
        },
        recommendation: {
            type: String,
            default: null,
        },
        predicted_failure_type: {
            type: String,
            enum: ["none", "hydraulic", "bearing", "electrical", "motor_overheat", "unknown"],
            default: "unknown",
        },
        estimated_time_to_failure_hours: {
            type: Number,
            default: null,
        },

        // ── Which AI provider produced this result ────────────────────
        ai_provider: {
            type: String,
            enum: ["claude", "openai", "rule_based"],
            default: "claude",
        },
        model_used: {
            type: String,
            default: null,
            comment: "e.g. claude-3-sonnet, gpt-4o",
        },

        // ── Raw response from AI (for debugging / audit) ───────────────
        raw_ai_response: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
        collection: "analysis_results",
    }
);

// Compound index: latest analysis per machine
analysisResultSchema.index({ machine_id: 1, createdAt: -1 });

// Index for dashboard: all high/critical risk items
analysisResultSchema.index({ risk_level: 1, createdAt: -1 });

module.exports = mongoose.model("AnalysisResult", analysisResultSchema);