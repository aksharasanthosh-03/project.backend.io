const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt');
const port = 3000;

const app = express();
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/Losigup');
const db = mongoose.connection;
db.once('open', () => {
    console.log("Mongodb connection successful");
});

const userSchema = new mongoose.Schema({
    regd_no: String,
    mobile: Number,
    email: { type: String, unique: true },
    password: String
});

const Users = mongoose.model("Users", userSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'form.html'));
});

app.post('/signup', async (req, res) => {
    const { regd_no, mobile, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new Users({
        regd_no,
        mobile,
        email,
        password: hashedPassword
    });
    try {
        await user.save();
        console.log(user);
        res.send(`
            <script>
                document.addEventListener('DOMContentLoaded', function() {
                    showPopup('Signup successful');
                });
                function showPopup(message) {
                    document.getElementById('popupMessage').innerText = message;
                    document.getElementById('popupContainer').style.display = 'flex';
                }
                function closePopup() {
                    document.getElementById('popupContainer').style.display = 'none';
                }
            </script>
            <div id="popupContainer" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(255, 182, 193, 0.5); justify-content: center; align-items: center; z-index: 1000;">
                <div style="background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); text-align: center;">
                    <h1 id="popupMessage"></h1>
                    <a href="/" style="display: inline-block; padding: 10px; background-color: #ffb6c1; text-decoration: none; border-radius: 5px; color: #333;">Back to Signup/Login</a>
                    <button onclick="closePopup()" style="margin-top: 10px; padding: 10px; background-color: #ffb6c1; border: none; border-radius: 5px; color: #333;">Close</button>
                </div>
            </div>
        `);
    } catch (error) {
        console.error(error);
        res.send("Error: Unable to signup");
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
        res.send(`
            <script>
                document.addEventListener('DOMContentLoaded', function() {
                    showPopup('Login successful');
                });
                function showPopup(message) {
                    document.getElementById('popupMessage').innerText = message;
                    document.getElementById('popupContainer').style.display = 'flex';
                }
                function closePopup() {
                    document.getElementById('popupContainer').style.display = 'none';
                }
            </script>
            <div id="popupContainer" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(255, 182, 193, 0.5); justify-content: center; align-items: center; z-index: 1000;">
                <div style="background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); text-align: center;">
                    <h1 id="popupMessage"></h1>
                    <a href="/" style="display: inline-block; padding: 10px; background-color: #ffb6c1; text-decoration: none; border-radius: 5px; color: #333;">Back to Signup/Login</a>
                    <button onclick="closePopup()" style="margin-top: 10px; padding: 10px; background-color: #ffb6c1; border: none; border-radius: 5px; color: #333;">Close</button>
                </div>
            </div>
        `);
    } else {
        res.send("Invalid email or password");
    }
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
