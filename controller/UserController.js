const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const user = db.User;

async function register(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password wajib di isi'
            });
        }

        const existingUser = await user.findOne({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'Email sudah terdaftar'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.User.create({
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            message: 'registrasi berhasil',
            data: {
                id: newUser.id,
                email: newUser.email
            }
        });
    }
    catch (error) {
        return res.status(500).json({
            message: 'terjadi kesalahan pada server',
            error: error.message
        });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email dan password wajib di isi'
            });
        }

        const Newuser = await db.User.findOne({
            where: { email }
        });

        if (!Newuser) {
            return res.status(404).json({
                message:'email atau password salah'
            });
        }

        const ismatch = await bcrypt.compare(password, Newuser.password);

        if (!ismatch) {
            return res.status(404).json({
                message:'email atau password salah'
            });
        }

        const token = jwt.sign(
            {
                id : Newuser.id,
                email : Newuser.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES
            }
        );
        
        return res.status(200).json({
            message: 'login berhasil',
            token
        });
    }
    catch (error) {
        return res.status(500).json({
            message: 'terjadi kesalahan pada server',
            error: error.message
        });
    }
}

module.exports = {
    register,
    login
};