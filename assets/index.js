let fileName = "compiler";

var xhttp = new XMLHttpRequest();

let pathname = window.location.pathname;
console.log(`${pathname}/addtime`);



let addTimeBtn = document.getElementById("addTimeBtn");
addTimeBtn.addEventListener('click',()=>{
  let addTimeInput = document.getElementById("addTimeInput");
  console.log(addTimeInput.value);
  let timeVal =  addTimeInput.value.split(":");
  if(timeVal.length != 3){
    document.getElementById('error').innerText = "Input format should be 00:00:00 (HH:MM:SS)";
    document.getElementById('success').innerHTML = "";
  } else {
    if(timeVal[1] > 60){
      document.getElementById('error').innerText = "Minutes should be less than 60";
      document.getElementById('success').innerHTML = "";
    } else if(timeVal[2] > 60){
      document.getElementById('error').innerText = "Seconds should be less than 60";
      document.getElementById('success').innerHTML = "";
    } else{
      let params = {
        time : addTimeInput.value
      }
      xhttp.open("POST", `${pathname}/addtime`, true);
      xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhttp.onload = (response)=>{
        response = JSON.parse(response.target.response);
        if(response.status == 200){
          document.getElementById('error').innerHTML = "";
          document.getElementById('success').innerHTML = response.msg;
        } else {
          document.getElementById('error').innerText = response.msg;
          document.getElementById('success').innerHTML = "";
        }
        getData();
      };
      xhttp.send(JSON.stringify(params));
    }
  }
});

let subtractTimeBtn = document.getElementById("subtractTimeBtn");
subtractTimeBtn.addEventListener("click",()=>{
  let subtractTimeInput = document.getElementById("subtractTimeInput");
  let timeVal =  subtractTimeInput.value.split(":");
  if(timeVal.length != 3){
    document.getElementById('error').innerText = "Input format should be 00:00:00 (HH:MM:SS)";
    document.getElementById('success').innerHTML = "";
  } else {
    if(timeVal[1] > 60){
      document.getElementById('error').innerText = "Minutes should be less than 60";
      document.getElementById('success').innerHTML = "";
    } else if(timeVal[2] > 60){
      document.getElementById('error').innerText = "Seconds should be less than 60";
      document.getElementById('success').innerHTML = "";
    } else{
      let params = {
        time : subtractTimeInput.value
      }
      xhttp.open("POST", `${pathname}/subtracttime`, true);
      xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhttp.onload = (response)=>{
        response = JSON.parse(response.target.response);
        if(response.status == 200){
          document.getElementById('error').innerHTML = "";
          document.getElementById('success').innerHTML = response.msg;
        } else {
          document.getElementById('error').innerText = response.msg;
          document.getElementById('success').innerHTML = "";
        }
        getData();
      };
      xhttp.send(JSON.stringify(params));
    }
  }
})

function secondsToTimeFormat(seconds){
  let str = `${Math.floor(seconds/(60*60))} : ${(Math.floor(seconds/(60)))%60} : ${seconds%(60)}` ;
  return str;
}

function getData(){
  xhttp.open("GET", `${pathname}/data`, true);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.onload = (response)=>{
    response = JSON.parse(response.target.response);
    console.log(response);
    document.getElementById("totalTime").innerHTML = secondsToTimeFormat(response.totalTime);
    document.getElementById("timeRemaining").innerHTML = secondsToTimeFormat(response.timeRemaining);
  };
  xhttp.send();
}
getData();




