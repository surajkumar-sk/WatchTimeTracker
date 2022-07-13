const express = require('express')
const path = require('path');
const app = express();
const fs = require('fs');
app.use(express.json());

function parseTime(time){
  let timearr = time.split(":");
  console.log(timearr)
  if(timearr.length != 3){
    return NaN;
  } else {
    let timeInSeconds = parseInt(timearr[2]) + parseInt(timearr[1])*60 + parseInt(timearr[0])*60*60;
    return timeInSeconds;
  }
}

app.get('/', (req, res) => {
  res.send("server running")
});

app.get('/file/:filename', (req, res) => {
  console.log(req.params.filename, req.query.totalTime)
  let totalTime = req.query.totalTime;
  let filename = req.params.filename;
  // try{
  //   let rawdata = fs.readFileSync(path.join(__dirname,`${filename}.json`));
  // }
  let fileExists = fs.existsSync(path.join(__dirname, 'assets', 'jsonData',`${filename}.json`));
  console.log(fs.existsSync(path.join(__dirname,`${filename}.json`)))
  if(!totalTime && fileExists){
    res.sendFile(path.join(__dirname,'index.html'));
  } 
  
  else if(totalTime && !fileExists){
    let totalTimeSeconds = parseTime(totalTime);
    if(isNaN(totalTimeSeconds)){
      res.send({
        status:400,
        msg:"Enter valid Number inside HH:MM:SS"
      });
      return;
    }
    let fileData = {
      "totalTime": totalTimeSeconds,
      "timeRemaining": totalTimeSeconds
    };
    fs.writeFile(path.join(__dirname, 'assets', 'jsonData',`${filename}.json`), JSON.stringify(fileData),()=>{
      console.log("file updated")
    });
    res.sendFile(path.join(__dirname,'index.html'));
  }

  else if(totalTime && fileExists){
    let totalTimeSeconds = parseTime(totalTime);
    if(isNaN(totalTimeSeconds)){
      res.send({
        status:400,
        msg:"Enter valid Number inside HH:MM:SS"
      });
      return;
    }
    let rawdata = fs.readFileSync(path.join(__dirname, 'assets', 'jsonData',`${filename}.json`));
    let data = JSON.parse(rawdata);
    let fileData = {
      "totalTime": totalTimeSeconds,
      "timeRemaining": data.timeRemaining
    };
    fs.writeFile(path.join(__dirname, 'assets', 'jsonData',`${filename}.json`), JSON.stringify(fileData),()=>{
      console.log("file updated")
    });
    res.sendFile(path.join(__dirname,'index.html'));
  } 

  else if(!totalTime && !fileExists){
    res.sendFile(path.join(__dirname,'error.html'))
  }
  
});

app.get('/file/:filename/data', (req, res) => {
  let filename = req.params.filename;
  let fileExists = fs.existsSync(path.join(__dirname, 'assets', 'jsonData',`${filename}.json`));
  if(fileExists){
    res.sendFile(path.join(__dirname, 'assets', 'jsonData',`${filename}.json`))
  } else {
    res.status(400).send({
      msg:"file  doesesn't exist"
    });
  }
});

app.post('/file/:filename/subtracttime', (req, res) => {
  let filename = req.params.filename;
  let fileExists = fs.existsSync(path.join(__dirname, 'assets', 'jsonData',`${filename}.json`));

  if(!fileExists){
    res.send({
      status:400,
      msg:"JSON file for current url doesn't exists"
    });
    return;
  }
  console.log(req.body)
  let totalTimeSeconds = parseTime(req.body.time);
  if(isNaN(totalTimeSeconds)){
    res.send({
      status:400,
      msg:"Enter valid Number inside HH:MM:SS"
    });
    return;
  }

  let rawdata = fs.readFileSync(path.join(__dirname, 'assets', 'jsonData',`${filename}.json`));
  let data = JSON.parse(rawdata);

  let timeRemaining = data.timeRemaining - totalTimeSeconds > 0 ? data.timeRemaining - totalTimeSeconds : 0;

  let fileData = {
    "totalTime": data.totalTime,
    "timeRemaining": timeRemaining
  };
  fs.writeFile(path.join(__dirname, 'assets', 'jsonData',`${filename}.json`), JSON.stringify(fileData),()=>{
    res.status(200).send({
      status:200,
      msg:"Time Updated"
    })
  });

});

app.post('/file/:filename/addtime', (req, res) => {
  let filename = req.params.filename;
  let fileExists = fs.existsSync(path.join(__dirname, 'assets', 'jsonData',`${filename}.json`));

  if(!fileExists){
    res.send({
      status:400,
      msg:"JSON file for current url doesn't exists"
    });
    return;
  }

  let totalTimeSeconds = parseTime(req.body.time);
  if(isNaN(totalTimeSeconds)){
    res.send({
      status:400,
      msg:"Enter valid Number inside HH:MM:SS"
    });
    return;
  }

  let rawdata = fs.readFileSync(path.join(__dirname, 'assets', 'jsonData',`${filename}.json`));
  let data = JSON.parse(rawdata);

  let timeRemaining = data.timeRemaining+totalTimeSeconds > data.totalTime ? data.totalTime : data.timeRemaining+totalTimeSeconds;

  let fileData = {
    "totalTime": data.totalTime,
    "timeRemaining": timeRemaining
  };
  fs.writeFile(path.join(__dirname, 'assets', 'jsonData',`${filename}.json`), JSON.stringify(fileData),()=>{
    res.status(200).send({
      status:200,
      msg:"Time Updated"
    })
  });
});

app.use(express.static(__dirname));


app.listen(3000,()=>{
  console.log('server running at 3000')
});