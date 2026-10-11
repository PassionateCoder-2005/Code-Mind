import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
    type: String,
    required: function () {
        return !this.googleId;
    },
    minlength: [6, "Password must be at least 6 characters long"],
},
    googleId: {
    type: String
}
},{
    timestamps: true,
});
userSchema.pre("save", async function () {
    if (!this.isModified("password") || !this.password) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}
const userModel = mongoose.model("user", userSchema);
export default userModel;