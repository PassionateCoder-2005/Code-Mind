import mongoose from "mongoose";
const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required"],
        unique: [true, "Token must be unique"]
    },
    expiresAt: {
        type: Date,
        required: [true, "Expiration date is required"]
    }
},{
    timestamps: true
});
// Create an index on the expiresAt field to automatically delete expired tokens
blacklistTokenSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);
const blacklistTokenModel = mongoose.model("blacklistToken", blacklistTokenSchema);
export default blacklistTokenModel;