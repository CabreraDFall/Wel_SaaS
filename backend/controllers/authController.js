const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
//Status: Agregadas dependencias para JWT y cookies
const pool = require('../index');

//Status: Agregado middleware para verificar el token JWT
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

const register = async (req, res) => {
  const { first_name, last_name, email, employee_number, role, password } = req.body;
  console.log('Datos recibidos:', req.body);

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store the user in the database
    const query = 'INSERT INTO users (first_name, last_name, email, employee_number, role, password) VALUES ($1, $2, $3, $4, $5, $6)';
    const values = [first_name, last_name, email, employee_number, role, hashedPassword];

    await pool.query(query, values);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Registration failed' });
  }
};

const refresh = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.status(401).json({ message: 'No refresh token in cookies' });
  }

  const refreshToken = cookies.jwt;

  try {
    // Check if the user exists
    const query = 'SELECT * FROM users WHERE refresh_token = $1';
    const values = [refreshToken];

    const result = await pool.query(query, values);
    const user = result.rows[0];

    if (!user) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err || user.email !== decoded.email) {
        return res.status(403).json({ message: 'Invalid refresh token' });
      }

      const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      //options for cookie
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
      ),
      httpOnly: false,
      secure: false,
      sameSite: 'None'
    };

      res.cookie('jwt', accessToken, options);
      res.status(200).json({ message: 'Access token refreshed successfully', accessToken });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Refresh failed' });
  }
};

const logout = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.sendStatus(204); // No content
  }

  const refreshToken = cookies.jwt;

  try {
    // Check if the user exists
    const query = 'SELECT * FROM users WHERE refresh_token = $1';
    const values = [refreshToken];

    const result = await pool.query(query, values);
    const user = result.rows[0];

    if (!user) {
      res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'None' });
      return res.sendStatus(204); // No content
    }

    // Delete refresh token in database
    const queryUpdate = 'UPDATE users SET refresh_token = $1 WHERE id = $2';
    const valuesUpdate = [null, user.id];

    await pool.query(queryUpdate, valuesUpdate);

    res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'None' });
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Logout failed' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];

    const result = await pool.query(query, values);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Generate Refresh Token
    const refreshToken = crypto.randomBytes(64).toString('hex');

    //options for cookie
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
      ),
      httpOnly: false,
      secure: false,
      sameSite: 'None'
    };

    res.cookie('jwt', accessToken, options);

    // update refresh token in database
    const queryUpdate = 'UPDATE users SET refresh_token = $1 WHERE id = $2';
    const valuesUpdate = [refreshToken, user.id];

    await pool.query(queryUpdate, valuesUpdate);

    
    res.status(200).json({ message: 'Login successful', accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed' });
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  verifyJWT,
};

//Status: Configurado las opciones secure: true y sameSite: 'None' en las cookies
