const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const port = 3001;

const app = express();
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/PaymentSystem');
const db = mongoose.connection;
db.on('error', (error) => console.error('Connection error:', error));
db.once('open', () => {
    console.log("MongoDB connection successful");
});

const paymentSchema = new mongoose.Schema({
    method: String,
    details: Object,
    status: String
});

const Payment = mongoose.model("Payment", paymentSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'form.html'));
});

app.post('/payment/netbanking', async (req, res) => {
    const { bank_name, account_number, ifsc } = req.body;
    const payment = new Payment({
        method: 'netbanking',
        details: { bank_name, account_number, ifsc },
        status: 'success'
    });

    try {
        await payment.save();
        res.send(`
            <script>
                document.addEventListener('DOMContentLoaded', function() {
                    showPopup('Net Banking Payment successful');
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
                    <a href="/" style="display: inline-block; padding: 10px; background-color: #ffb6c1; text-decoration: none; border-radius: 5px; color: #333;">Back to Payment Options</a>
                    <button onclick="closePopup()" style="margin-top: 10px; padding: 10px; background-color: #ffb6c1; border: none; border-radius: 5px; color: #333;">Close</button>
                </div>
            </div>
        `);
    } catch (error) {
        console.error('Error saving payment:', error);
        res.send("Error: Unable to process payment");
    }
});

app.post('/payment/upi', async (req, res) => {
    const { upi_id } = req.body;
    const payment = new Payment({
        method: 'upi',
        details: { upi_id },
        status: 'success'
    });

    try {
        await payment.save();
        res.send(`
            <script>
                document.addEventListener('DOMContentLoaded', function() {
                    showPopup('UPI Payment successful');
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
                    <a href="/" style="display: inline-block; padding: 10px; background-color: #ffb6c1; text-decoration: none; border-radius: 5px; color: #333;">Back to Payment Options</a>
                    <button onclick="closePopup()" style="margin-top: 10px; padding: 10px; background-color: #ffb6c1; border: none; border-radius: 5px; color: #333;">Close</button>
                </div>
            </div>
        `);
    } catch (error) {
        console.error('Error saving payment:', error);
        res.send("Error: Unable to process payment");
    }
});

app.post('/payment/card', async (req, res) => {
    const { card_number, expiry_date, cvv } = req.body;
    const payment = new Payment({
        method: 'card',
        details: { card_number, expiry_date, cvv },
        status: 'success'
    });

    try {
        await payment.save();
        res.send(`
            <script>
                document.addEventListener('DOMContentLoaded', function() {
                    showPopup('Card Payment successful');
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
                    <a href="/" style="display: inline-block; padding: 10px; background-color: #ffb6c1; text-decoration: none; border-radius: 5px; color: #333;">Back to Payment Options</a>
                    <button onclick="closePopup()" style="margin-top: 10px; padding: 10px; background-color: #ffb6c1; border: none; border-radius: 5px; color: #333;">Close</button>
                </div>
            </div>
        `);
    } catch (error) {
        console.error('Error saving payment:', error);
        res.send("Error: Unable to process payment");
    }
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
