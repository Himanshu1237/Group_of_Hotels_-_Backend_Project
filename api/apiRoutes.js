const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();


router.post('/login', async(req, res)=>{
    const {username, password} = req.body;
    let data = await fs.readFileSync(path.join(__dirname, '../models/users.json'), 'utf-8');
    data = await JSON.parse(data);
    const user = data.find(user=>user.username===username && user.password===password);
    if(user){
      return res.redirect('/home');
    }
    else{
        return res.redirect('/register');
    }
});

router.post('/register', async(req, res)=>{
    const {username, password} = req.body;
    let data = await fs.readFileSync(path.join(__dirname, '../models/users.json'), 'utf-8');
    data = await JSON.parse(data);
    const user = data.find(user=>user.username===username);
    if(user){
        return res.status(401).json({error: 'User already exists'});
    }
    else{
        data.push({username, password});
        await fs.writeFileSync(path.join(__dirname, '../models/users.json'), JSON.stringify(data));
        res.redirect('/home');
    }
})

module.exports = router;
