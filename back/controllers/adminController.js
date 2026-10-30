const Admin = require("../moduls/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const admin = await Admin.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    if (!admin || !admin.isActive) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
    });
  }
};

const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");

    res.json(admins);
  } catch (error) {
    res.status(500).json({
      message: "Could not get admins",
    });
  }
};

const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password || password.length < 8) {
      return res.status(400).json({
        message: "Provide name, email and a password of at least 8 characters",
      });
    }

    const maxAdmins = Number(process.env.MAX_ADMIN_USERS || 3);
    const adminCount = await Admin.countDocuments();

    if (adminCount >= maxAdmins) {
      return res.status(403).json({
        message: "Maximum number of admin accounts reached",
      });
    }

    const existingAdmin = await Admin.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingAdmin) {
      return res.status(409).json({
        message: "This email is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await Admin.create({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        isActive: admin.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not create admin",
    });
  }
};

const updateAdminStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        message: "isActive must be true or false",
      });
    }

    if (req.params.id === req.admin.id && !isActive) {
      return res.status(400).json({
        message: "You cannot deactivate your own account",
      });
    }

    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, runValidators: true },
    ).select("-password");

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    res.json({
      message: "Admin status updated",
      admin,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not update admin",
    });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    if (req.params.id === req.admin.id) {
      return res.status(400).json({
        message: "You cannot delete your own account",
      });
    }

    const admin = await Admin.findByIdAndDelete(req.params.id);

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    res.json({
      message: "Admin deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not delete admin",
    });
  }
};

module.exports = {
  login,
  getAdmins,
  createAdmin,
  updateAdminStatus,
  deleteAdmin,
};
