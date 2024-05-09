const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/interview');
  console.log('db connected')
}
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const User = mongoose.model('User', userSchema);




const server = express();

server.use(cors());
server.use(bodyParser.json());

// CRUD - Create
server.post('/demo',async (req,res)=>{
     
    let user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    const doc = await user.save();

    console.log(doc);
    res.json(doc);
})

server.get('/demo',async (req,res)=>{
    const docs = await User.find({});
    res.json(docs)
})

// Update user data
server.put('/demo/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { username, password } = req.body;

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update user properties if they are provided in the request body
        if (username) {
            user.username = username;
        }
        if (password) {
            user.password = password;
        }

        // Save the updated user object
        const updatedUser = await user.save();

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


server.listen(8080,()=>{
    console.log('server started')
})