import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Creating Schemas
const studentDataSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    isRegistered: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const teacherDataSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    isRegistered: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    college: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["Student", "Teacher"],
        default: "Student",
        required: true
    },
    expertise: {
        type: [String],
        required: function () {
            return this.role == "Teacher"
        }
    },
    profilePicture: {
        type: String,
        default: "https://www.google.com/imgres?q=profileIcon&imgurl=https%3A%2F%2Fbanner2.cleanpng.com%2F20180327%2Fssq%2Favjc8xfge.webp&imgrefurl=https%3A%2F%2Fwww.cleanpng.com%2Fpng-computer-icons-user-profile-avatar-profile-688555%2F&docid=XUaR9YYHABdLoM&tbnid=lFLzFkjhvb2TGM&vet=12ahUKEwjAl4CvkPGLAxVoc_UHHZNMMj0QM3oFCIYBEAA..i&w=900&h=920&hcb=2&ved=2ahUKEwjAl4CvkPGLAxVoc_UHHZNMMj0QM3oFCIYBEAA"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date,
        default: Date.now()
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
}, { timestamps: true })

// Methods on userSchema
//encrypting user password before saving it in DB
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrpt.hash(this.password, 10);
    next();
})

// method to check if user password is same as password stored in DB
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrpt.compare(password, this.password);
}

//method to generate JWT Token
userSchema.methods.generateJwtToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        role: this.role
    }, process.env.JWT_SECRET);
}


// Creating Models using Schema
const StudentData = mongoose.model("StudentData", studentDataSchema);
const TeacherData = mongoose.model("TeacherData", teacherDataSchema);
const User = mongoose.model("User", userSchema);

export { StudentData, TeacherData, User };