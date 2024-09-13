

var CURRENT_ROOM = "";
var totalSecond = 10;
var currentUser = "";
var room = document.querySelector("#room");
var element = document.querySelector("#offerValue");
var timeSection = document.querySelector("#time-section");
var time = document.querySelector("#time");
var button = document.querySelector("#offerBtn");
var bmwRoomCount;
var chevRoomCount;

const connection = new signalR.HubConnectionBuilder()
  .withUrl("https://localhost:7091/offers")
  .configureLogging(signalR.LogLevel.Information)
  .build();

const url = "https://localhost:7091/";
async function start() {
  try {
    await connection.start();
    $.get(url + "api/Offer/Room?room="+CURRENT_ROOM, function (data, status) {
      element.innerHTML = "Begin price : " + data + "$";
    });

    console.log("SignalR Started");
  } catch (err) {
    console.log(err);
    setTimeout(() => {
      start();
    }, 5000);
  }
}

connection.on("ReceiveJoinInfo",(room,user)=>
{
  const infoUser = document.querySelector("#info");
  if(room =="chevrolet" && chevRoomCount <3)
  {
    infoUser.innerHTML= user + " connected to our room";
  }
  if(room =="bmw" && bmwRoomCount <3)
  {
    infoUser.innerHTML= user + " connected to our room";
  }

  
})

connection.on("ReceiveInfoRoom",(user,data)=>
{
  var element2 = document.querySelector("#offerValue2");
  element2.innerHTML=user + " offer this price " + data + "$";
  button.disabled = false;
  timeSection.style.display = "none";
  clearTimeout(myInterval);
  totalSecond=10;
  leave=document.querySelector("#leave");
  leave.style.display = "block";
  
})


connection.on("ReceiveWinInfoRoom",(user,data)=>
{
  var element2 = document.querySelector("#offerValue2");
  element2.innerHTML=user + "offer this price " + data + "$";
  button.disabled = true;
  timeSection.style.display = "none";
  
})

connection.on("ReceiveLeaveInfo",(user)=>
{
  var element2 = document.querySelector("#info");
  element2.innerHTML=user;
  // button.disabled = true;
  // timeSection.style.display = "none";
  
})

connection.on("ReceiveCount",(room,data)=>
{
  // var element2 = document.querySelector("#info");
  // element2.innerHTML=user;
  // button.disabled = true;
  // timeSection.style.display = "none";
  var h1 = document.getElementById("count");
  if(room == "chevrolet")
  {
    chevRoomCount = data;
    if(data <= 3)
    {
      h1.innerHTML = `Count of users the room : ${chevRoomCount}`;
      h1.style.display = "block";
    }
  }
  if(room == "bmw")
  {
    bmwRoomCount = data;
    if(data <= 3)
    {
      h1.innerHTML = `Count of users the room : ${bmwRoomCount}`;
      h1.style.display = "block";
    }
  }
  
})

connection.on("ReceiveCount2",(room,data)=>
{
  // var element2 = document.querySelector("#info");
  // element2.innerHTML=user;
  // button.disabled = true;
  // timeSection.style.display = "none";

  var h1 = document.getElementById("count");
  if(room == "chevrolet")
  {
    chevRoomCount = data;
      h1.innerHTML = `Count of users the room : ${chevRoomCount}`;
      h1.style.display = "block";
    
  }
  if(room == "bmw")
  {
    bmwRoomCount = data;
    
      h1.innerHTML = `Count of users the room : ${bmwRoomCount}`;
      h1.style.display = "block";
    
  }
  
})

// connection.on("ReceiveAllCount",(room,data)=>
// {
//   // var element2 = document.querySelector("#info");
//   // element2.innerHTML=user;
//   // button.disabled = true;
//   // timeSection.style.display = "none";

//   if(room == "chevrolet")
//   {
//     chevRoomCount = data;
//   }
//   if(room == "bmw")
//   {
//     bmwRoomCount = data;
//   }
  
// });

// connection.invoke("ReturnCount","chevrolet");


async function JoinChevrolet()
{
  CURRENT_ROOM = "chevrolet";
  var message = document.querySelector("#message");
  message.style.display = "none";
  await start();
  currentUser=document.querySelector("#user").value;
  await connection.invoke("JoinRoom",CURRENT_ROOM,currentUser);
  await connection.invoke("RoomCount",CURRENT_ROOM);
  
  if(chevRoomCount > 3)
  {
    message.innerHTML = "This Room is full";
    message.style.display = "block";
    return;
  }
  
    // chevRoomCount+=1;
    // var h1 = document.getElementById("count");
    // h1.innerHTML = `Count of users the room : ${chevRoomCount}`;
    room.style.display = "block";
    let chev=document.querySelector("#chev");
    let bmw=document.querySelector("#bmw");
    let leave=document.querySelector("#leave");
    let currentRoom = document.querySelector("#currentRoom");
    currentRoom.innerHTML = `Current Room is : ${CURRENT_ROOM}`; 
    leave.style.display = "block"
    chev.style.display = "none";
    bmw.style.display = "none";
    currentRoom.style.display = "block";

  
}

async function LeaveRoom()
{
  // if(CURRENT_ROOM == "bmw")
  // {
  //   bmwRoomCount-=1;
  //   var h1 = document.getElementById("count");
  //   h1.innerHTML = `Count of users the room : ${bmwRoomCount}`;
  // }
  // if(CURRENT_ROOM == "chevrolet")
  // {
  //   chevRoomCount-=1;
  //   var h1 = document.getElementById("count");
  //   h1.innerHTML = `Count of users the room : ${chevRoomCount}`;
  // }
  chev=document.querySelector("#chev");
  bmw=document.querySelector("#bmw");
  leave=document.querySelector("#leave");
  room=document.querySelector("#room");
  let currentRoom=document.querySelector("#currentRoom");
  let count=document.querySelector("#count");
  leave.style.display = "none";
  room.style.display = "none";
  currentRoom.style.display = "none";
  count.style.display = "none";
  chev.style.display = "inline-block";
  bmw.style.display = "inline-block";
  await connection.invoke("RoomCount2",CURRENT_ROOM);
  await connection.invoke("LeaveRoom",CURRENT_ROOM,currentUser);

}

async function JoinBMW()
{
  var message = document.querySelector("#message");
  message.style.display = "none";
  CURRENT_ROOM = "bmw";
  await start();
  currentUser=document.querySelector("#user").value;
  await connection.invoke("JoinRoom",CURRENT_ROOM,currentUser);
  await connection.invoke("RoomCount",CURRENT_ROOM);
  if(bmwRoomCount > 3)
  {
    message.innerHTML = "This Room is full";
    message.style.display = "block";
    return;
  }
  
    // bmwRoomCount+=1;
    // var h1 = document.getElementById("count");
    // h1.innerHTML = `Count of users the room : ${bmwRoomCount}`;
    room.style.display = "block";
    let chev=document.querySelector("#chev");
    let bmw=document.querySelector("#bmw");
    let leave=document.querySelector("#leave");
    let currentRoom = document.querySelector("#currentRoom");
    currentRoom.innerHTML = `Current Room is : ${CURRENT_ROOM}`; 
    leave.style.display = "block";
    chev.style.display = "none";
    bmw.style.display = "none";
    currentRoom.style.display = "block";
  

}

var myInterval;

async function IncreaseOffer()
{
  leave=document.querySelector("#leave");
  leave.style.display = "none";
  clearTimeout(myInterval);
  totalSecond = 10;
  timeSection.style.display = "block";
  time.innerHTML = totalSecond;
  let result = document.querySelector("#user");
  var lastOffer = 0;
  $.get(`${url}api/Offer/IncreaseRoom?room=${CURRENT_ROOM}&data=100`,function()
  {
    $.get(url + "api/Offer/Room?room="+CURRENT_ROOM,async function (data, status) {
      var element2 = document.querySelector("#offerValue2");
      element2.innerHTML = data;
      lastOffer=data;

      await connection.invoke("SendMessageRoom",CURRENT_ROOM,result.value)
      button.disabled = true;

      myInterval = setInterval(async() => {
        --totalSecond;
        time.innerHTML = totalSecond;

        if(totalSecond==0)
        {
          totalSecond=10;
          button.disabled=true;
          clearTimeout(myInterval);
          leave.style.display = "block";
          await connection.invoke("SendWinnerMessageRoom",CURRENT_ROOM,"Game Over \n" + result.value+" is winner!");

        }
      }, 1000);
    });
  })
}