import mongoose from "mongoose";
const refreshTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [ true, "Refresh token is required"],
        unique: [true, "Refresh token must be unique"]
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "User ID is required"]
    },
    revoked: {
    type: Boolean,
    default: false
},
expiresAt: {
    type: Date,
    required: [true, "Expiration date is required"]
}
},{
    timestamps: true
});
const refreshTokenModel = mongoose.model("refreshToken", refreshTokenSchema);
export default refreshTokenModel;