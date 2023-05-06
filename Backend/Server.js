  
const express = require('express')
const mongoose = require('mongoose')
const Student = require('./models/studentModel')
const KillRequest = require('./models/killRequestModel')

const app = express()
const cors = require('cors');
var nodemailer = require('nodemailer');

app.use(cors({
}));
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.get('/', async(req, res) => {
  res.send("WORKING")
  await Student.updateMany({}, {alive: true})
})

app.get('/email', (req, res) => {
  sendTargetsByEmail()
})

app.get('/assignTargets', (req, res) => {
  assignTargets()
  res.send("ASSIGNED")
})

app.get('/newRound', (req, res) => {
  newRound()
  res.send("NEW ROUND BEGUN")
})

app.post('/killRequests', async(req, res) => {
  try {
    // let testForStudent = await Student.findOne({ name: req.body.name });
 
    // if (testForStudent) {
    //   return res.status(401).json({ message: "Invalid Credentials" });
    // }
      
    const request = await KillRequest.create(req.body)
    res.status(200).json(request);
        
  } catch (error) {
      console.log(error.message);
      res.status(500).json({message: error.message})
    }  
  res.send("sent")
})
app.post('/kill', async(req, res) => {
  try {
    kill(req.body.name1, req.body.name2)
        
  } catch (error) {
      console.log(error.message);
      res.status(500).json({message: error.message})
    }  
  res.send("sent")
})
app.get('/killRequests', async(req, res) => {
    try {
        const requests = await KillRequest.find({});
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.delete('/killRequests/:id', async(req, res) =>{
    try {
        const {id} = req.params;
        const killRequest = await KillRequest.findByIdAndDelete(id);
        if(!killRequest){
            return res.status(404).json({message: `cannot find any student with ID ${id}`})
        }
        res.status(200).json(killRequest);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//Get all students in DB
app.get('/students', async(req, res) => {
    try {
        const students = await Student.find({});
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// Get specific student
app.get('/students/:id', async(req, res) =>{
    try {
        const {id} = req.params;
        const student = await Student.findById(id);
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.post('/killRequests', async(req, res) => {
    try {
      
      const killRequest = await KillRequest.create(req.body)
      res.status(200).json(killRequest);
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
})

// Add a student
app.post('/students', async(req, res) => {
    try {
      let testForStudent = await Student.findOne({ name: req.body.name });
 
      if (testForStudent) {
        return res.status(401).json({ message: "Invalid Credentials" });
      }
      
      const student_ = await Student.create(req.body)
      res.status(200).json(student_);
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
})

// update a student
app.put('/students/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const student = await Student.findByIdAndUpdate(id, req.body);
        // we cannot find any student in database
        if(!student){
            return res.status(404).json({message: `cannot find any student with ID ${id}`})
        }
        const updatedStudent = await Student.findById(id);
        res.status(200).json(updatedStudent);
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


// delete a student
app.delete('/students/:id', async(req, res) =>{
    try {
        const {id} = req.params;
        const student = await Student.findByIdAndDelete(id);
        if(!student){
            return res.status(404).json({message: `cannot find any student with ID ${id}`})
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


// ~~~~~~~~~~~~~~ Assigns unique player target to each player ~~~~~~~~~~~~~~~~
async function assignTargets() {
  try {
    const students = await Student.find({alive: true})
    var targets = students.map(student => student.toObject())
    var n = targets.length;
    var perm = [];
    for(var i = 0; i < n; i++) {
      perm.push(i);
    }

    for(var i = 0; i < n - 1; i++) {
      var switch_ = i + 1 + Math.floor(Math.random() * (n - i - 1));
      var temp = perm[i];
      perm[i] = perm[switch_];
      perm[switch_] = temp;
    }

    for(var i = 0; i < perm.length; i++)
      targets[i].target = targets[perm[i]].name;

    targets.map(async(item) => {
      const student = await Student.findByIdAndUpdate(item._id, {target: item.target});

    
    })
    // 
  } catch (error) {
    console.log(error.message)
  }
}
// Send all players an email telling them their target
const transporter = nodemailer.createTransport({
port: 465,               // true for 465, false for other ports
host: "smtp.gmail.com",
   auth: {
        user: 'ayang3612@stu.hinsdale86.org',
        pass: '11292004',
     },
secure: true,
});


async function sendTargetsByEmail(){
  const students = await Student.find({alive: true})
  students.forEach((student) => {
    const mailData = {
    from: 'ayang3612@stu.hinsdale86.org',  // sender address
    to: student.email,   // list of receivers
    subject: 'HIIII',
    text: 'That was easy!',
    html: '<b>Hey '+ student.name + '! Your target is ' + student.target + '!</b>'
  };
  transporter.sendMail(mailData, function (err, info) {
   if(err)
     console.log(err)
   else
     console.log("Success for " + student.name);
  })
  

  
});
}

//kill function, assigns their target to whoever!
async function kill(killer_,victim_) {
  try {
    const killer = (await Student.find({name: killer_}))[0];
    const victim = (await Student.find({name: victim_}))[0];

    
    const student1 = await Student.findByIdAndUpdate(killer._id, {target: victim.target, roundKills: killer.roundKills + 1, totalKills: killer.totalKills + 1});
    const student2 = await Student.findByIdAndUpdate(victim._id, {alive: false});
  } catch (error) {
    console.log(error)
  }
}


//begins a new round; enacts hermit rule and makes all roundKills 0
async function newRound(){
  const data = await Student.find({})
  var students = data.map(data => data.toObject())
  //if the target of a student has gotten a kill and they havent, eliminate them
  students.forEach(async(student) => {
    const target = await Student.find({name: student.target})
    if(student.roundKills == 0 && target.roundKills >= 1) {
      const student = await Student.findByIdAndUpdate(student._id, {alive: false});
    }
  })
  
  students.map(async(item) => {
      const student = await Student.findByIdAndUpdate(item._id, {roundKills: 0});
    })
}



// Connection to DB
mongoose.set("strictQuery", false)
mongoose.
connect('mongodb+srv://yaseenalex:yaseenalex@assassinapi.exkgu89.mongodb.net/?retryWrites=true&w=majority')
.then(() => {
    console.log('connected to MongoDB')
    app.listen(3000, ()=> {
        console.log(`Node API app is running on port 3000`)
    });
}).catch((error) => {
    console.log(error)
})