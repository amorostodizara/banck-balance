const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// Générer un token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "24h" },
  );
};

exports.authenticate = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "Username et password requis",
      });
    }

    const user = await User.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        error: "Identifiants invalides",
      });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.initUsers = async (req, res) => {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      const users = [
        {
          name: "Jean Dupont",
          username: "admin",
          password: "Admin123!",
          role: "admin",
        },
        {
          name: "Marie Rakoto",
          username: "admin2",
          password: "Admin234!",
          role: "admin",
        },
        {
          name: "Paul Martin",
          username: "viewer",
          password: "Viewer123!",
          role: "viewer",
        },
        {
          name: "Alice Bernard",
          username: "viewer2",
          password: "Viewer234!",
          role: "viewer",
        },
        {
          name: "Lucie Andrian",
          username: "manager",
          password: "Manager123!",
          role: "viewer",
        },
      ];

      // hachage manuel
      for (let u of users) {
        u.password = await bcrypt.hash(u.password, 10);
      }

      await User.insertMany(users);

      res.json({
        success: true,
        message: `${users.length} utilisateurs initialisés avec succès`,
      });
    } else {
      res.json({
        success: true,
        message: `${count} utilisateurs déjà existants`,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Utilisateur non trouvé",
      });
    }

    res.json({
      success: true,
      data: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    // Seul l'admin peut voir tous les utilisateurs
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Accès non autorisé",
      });
    }

    const users = await User.find().select("-password");

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
