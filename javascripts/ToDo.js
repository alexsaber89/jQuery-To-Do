"use strict";

let apiKeys = {};
let uid = "";

function putTodoInDOM() {
  FbAPI.getTodos(apiKeys, uid).then(function(items) {
    $("#completed-tasks").html("");
    $("#incomplete-tasks").html("");
    items.forEach(function(item) {
      if (item.isCompleted === true) {
        let newListItem = `<li data-completed="${item.isCompleted}">`;
        newListItem+=`<div class="col-xs-8" data-fbid="${item.id}">`;
        newListItem+='<input class="checkboxStyle" type="checkbox" checked>';
        newListItem+=`<label class="inputLabel">${item.task}</label>`;
        newListItem+='</div>';
        newListItem+='</li>';
        //apend to list
        $('#completed-tasks').append(newListItem);
      } else {
        let newListItem = `<li data-completed="${item.isCompleted}">`;
        newListItem+=`<div class="col-xs-8" data-fbid="${item.id}">`;
        newListItem+='<input class="checkboxStyle" type="checkbox">';
        newListItem+=`<label class="inputLabel">${item.task}</label>`;
        newListItem+='<input type="text" class="inputTask">';
        newListItem+='</div>';
        newListItem+='<div class="col-xs-4">';
        newListItem+=`<button class="btn btn-default col-xs-6 edit" data-fbid="${item.id}">Edit</button>`;
        newListItem+=`<button class="btn btn-danger col-xs-6 delete" data-fbid="${item.id}">Delete</button> `;
        newListItem+='</div>';
        newListItem+='</li>';
        //apend to list
        $('#incomplete-tasks').append(newListItem);
      }
    });
  });
}

function createLogoutButton() {
  FbAPI.getUser(apiKeys,uid).then(function(userResponse) {
    console.log("userResponse",userResponse);
    $("#logout-container").html("");
    let currentUsername = userResponse.username;
    let logoutButton = `<button class="btn btn-danger" id="logoutButton">LOGOUT ${currentUsername}</button>`;
    $("#logout-container").append(logoutButton);
  });
}

$("#logout-container").on("click","#logoutButton",function() {
  FbAPI.logoutUser();
  uid = "";
  $("#incomplete-tasks").html("");
  $("#completed-tasks").html("");
  $("#inputEmail").val("");
  $("#inputPassword").val("");
  $("#inputUsername").val("");
  $("#login-container").removeClass("hide");
  $("#master-to-do-container").addClass("hide");
});

$(document).ready(function() {
  FbAPI.firebaseCredentials().then(function(keys){
    apiKeys = keys;
    firebase.initializeApp(apiKeys);
  });

  $("#add-btn").on("click",function() {
    let newItem = {
      "task":$("#userInput").val(),
      "isCompleted":false,
      "uid": uid
    };
    FbAPI.addTodo(apiKeys,newItem).then(function(){
      putTodoInDOM();
    });
  });

  $("div").on("click",".delete",function() {
    let itemID = $(this).data("fbid");
    FbAPI.deleteTodo(apiKeys,itemID).then(function() {
      putTodoInDOM();
    });
  });

  $("#to-do-container").on("click",".edit",function() {
    let parent = $(this).closest("li");
    if (!parent.hasClass("editMode")) {
      parent.addClass("editMode");
    } else {
      //firebase stuff
      let itemID = $(this).data("fbid");
      let editedItem = {
        "task": parent.find(".inputTask").val(),
        "isCompleted": false,
        "uid": uid
      };
      FbAPI.editTodo(apiKeys,itemID,editedItem).then(function(response){
        parent.removeClass("editMode");
        putTodoInDOM();
      });
    }
  });

  $("#registerButton").on("click",function() {
    let email = $("#inputEmail").val();
    let password = $("#inputPassword").val();
    let userName = $("#inputUsername").val();
    let user = {
      "email": email,
      "password": password
    };
    FbAPI.registerUser(user).then(function(registerResponse) {
      console.log("Registration response: ", registerResponse);
      let newUser = {
        "username": userName,
        "uid": registerResponse.uid
      };
      return FbAPI.addUser(apiKeys,newUser);
    }).then(function(addUserResponse) {
      return FbAPI.loginUser(user);
    }).then(function(loginResponse) {
      console.log("Login response: ",loginResponse);
      uid = loginResponse.uid;
      putTodoInDOM();
      $("#login-container").addClass("hide");
      $("#master-to-do-container").removeClass("hide");
    });
  });

  $("#loginButton").on("click",function() {
    let email = $("#inputEmail").val();
    let password = $("#inputPassword").val();
    let user = {
      "email": email,
      "password": password
    };
    FbAPI.loginUser(user).then(function(loginResponse) {
      console.log("Login response: ",loginResponse);
      uid = loginResponse.uid;
      createLogoutButton();
      putTodoInDOM();
      $("#login-container").addClass("hide");
      $("#master-to-do-container").removeClass("hide");
    });
  });

  $("ul").on("change",'input[type="checkbox"]', function() {
    let updatedIsCompleted = $(this).closest("li").data("completed");
    let itemId = $(this).parent().data("fbid");
    let task = $(this).siblings(".inputLabel").html();
    let editedItem = {
      "task": task,
      "isCompleted": !updatedIsCompleted,
      "uid": uid
    };
    FbAPI.editTodo(apiKeys, itemId, editedItem).then(function() {
      createLogoutButton();
      putTodoInDOM();
    });
  });

});

// let ToDo = (function() {
//   let body = $("#body");
//   let toDoDiv = $("#to-do");
//   let toDoDivArray = [];
//   let completedDiv = $("#completed");
//   let completedDivArray = [];
//   let addBtn = $("#add-btn");
//   let userInput = $("#userInput");
//   let uniqueID = 0;
//   $(document).ready(function() {
//     userInput.focus();
//   });
//   return {
//     addEvents: function() {
//       //Collect User Input event
//       addBtn.on("click",ToDo.getUserInput);
//       userInput.on("keyup", function(event) {
//         event.preventDefault();
//         if (event.keyCode == 13) {
//           ToDo.getUserInput();
//         }
//       });
//       //Delete Button event
//       body.on("click", function(event) {
//         if ($(event.target).hasClass("delete-btn")) {
//           let targetedToDoId = $(event.target).closest(".to-do-wrapper").attr("id");
//           let array = "";
//           let div = "";
//           if ($(event.target).closest(".to-do-wrapper").parent().parent().attr("id") === "completed-container") {
//             array = completedDivArray;
//             div = completedDiv;
//           } else {
//             array = toDoDivArray;
//             div = toDoDiv;
//           }
//           for (var i = 0; i < array.length; i++) {
//             if (parseInt(array[i].id) === parseInt(targetedToDoId)) {
//               let targetedToDoObject = array[i];
//               array.splice(array.indexOf(targetedToDoObject),1);
//               ToDo.displayUserToDoItems(array,div);
//             }
//           }
//         }
//       });
//       //Edit Button event
//       body.on("click", function(event) {
//         if ($(event.target).hasClass("edit-btn")) {
//           let targetedToDoId = $(event.target).closest(".to-do-wrapper").attr("id");
//           for (var i = 0; i < toDoDivArray.length; i++) {
//             if (parseInt(toDoDivArray[i].id) === parseInt(targetedToDoId)) {
//                 let targetedToDoObject = toDoDivArray[i];
//                 targetedToDoObject.text = userInput.val();
//                 ToDo.displayUserToDoItems(toDoDivArray,toDoDiv);
//             }
//           }
//           userInput.val("");
//         }
//       });
//       //Checkbox event
//       body.on("change", function(event) {
//         if ($(event.target).hasClass("checkbox")) {
//           let targetedToDoId = $(event.target).closest(".to-do-wrapper").attr("id");
//           let currentArray = "";
//           let currentDiv = "";
//           let newArray = "";
//           let newDiv = "";
//           if ($(event.target).closest(".to-do-wrapper").parent().parent().attr("id") === "completed-container") {
//             currentArray = completedDivArray;
//             currentDiv = completedDiv;
//             newArray = toDoDivArray;
//             newDiv = toDoDiv;
//           } else {
//             currentArray = toDoDivArray;
//             currentDiv = toDoDiv;
//             newArray = completedDivArray;
//             newDiv = completedDiv;
//           }
//           for (var i = 0; i < currentArray.length; i++) {
//             if (parseInt(currentArray[i].id) === parseInt(targetedToDoId)) {
//               let targetedToDoObject = currentArray[i];
//               newArray.push(targetedToDoObject);
//               ToDo.displayUserToDoItems(newArray,newDiv);
//               currentArray.splice(currentArray.indexOf(targetedToDoObject),1);
//               ToDo.displayUserToDoItems(currentArray,currentDiv);
//             }
//           }
//         }
//       });
//     },
//     getUserInput: function(event) {
//       if (userInput.val() !== "") {
//         uniqueID++;
//         let whichArray = "toDoDivArray";
//         ToDo.setUserToDoObject(uniqueID,userInput.val(),whichArray);
//         userInput.val("");
//         userInput.focus();
//       }
//     },
//     setUserToDoObject: function(uniqueID,userInput,whichArray) {
//       var userToDoObject = {
//         "id": uniqueID,
//         "text": userInput
//       };
//       if (whichArray === "toDoDivArray") {
//         toDoDivArray.push(userToDoObject);
//       } else if(whichArray === "completedDivArray") {
//         completedDivArray.push(userToDoObject);
//       }
//       ToDo.displayUserToDoItems(toDoDivArray,toDoDiv);
//     },
//     displayUserToDoItems: function(array,displayDiv) {
//       let displayedToDoItems = "";
//       array.forEach((object) => {
//         displayedToDoItems += `<div id=${object.id} class="to-do-wrapper"> `;
//         if (displayDiv === completedDiv) {
//           displayedToDoItems += `<div class="checkbox-style"><label><input class="checkbox" type="checkbox" value="" checked></label></div>`;
//         } else {
//           displayedToDoItems += `<div class="checkbox-style"><label><input class="checkbox" type="checkbox" value=""></label></div>`;
//           displayedToDoItems += `<button type="button" class="btn btn-primary btn-sm edit-btn">Edit</button> `;
//         }
//         displayedToDoItems += `<button type="button" class="btn btn-primary btn-sm delete-btn">Delete</button> `;
//         displayedToDoItems += `<div class="to-do_text">${object.text}</div>`;
//         displayedToDoItems += `<br />`;
//         displayedToDoItems += `</div>`;
//       });
//       displayDiv.html(displayedToDoItems);
//     }
//   };
// })();
//
// ToDo.addEvents();
