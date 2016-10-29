"use strict";

let ToDo = (function() {
  let body = $("#body");
  let toDoDiv = $("#to-do");
  let toDoDivArray = [];
  let completedDiv = $("#completed");
  let completedDivArray = [];
  let addBtn = $("#add-btn");
  let userInput = "";
  let uniqueID = 0;

  return {
    addEvents: function() {
      addBtn.on("click",ToDo.getUserInput);
      body.on("click", function(event) {
        if ($(event.target).hasClass("delete-btn")) {
          console.log("delete button clicked");
        }
      });
      body.on("click", function(event) {
        if ($(event.target).hasClass("edit-btn")) {
          console.log("edit button clicked");
        }
      });
    },
    getUserInput: function(event) {
      userInput = $("#userInput").val();
      if (userInput !== "") {
        uniqueID++;
        ToDo.setUserToDoObject(uniqueID,userInput);
        userInput = "";
      }
    },
    setUserToDoObject: function(uniqueID,userInput) {
      var userToDoObject = {
        "id": uniqueID,
        "text": userInput
      };
      toDoDivArray.push(userToDoObject);
      console.log("toDoDivArray: ",toDoDivArray);
      ToDo.displayUserToDoItems();
    },
    displayUserToDoItems: function() {
      let displayedToDoItems = "";
      displayedToDoItems += `<h2>To Do</h2>`;
      toDoDivArray.forEach((object) => {
        console.log(object.text);
        displayedToDoItems += `<button type="button" class="btn btn-primary btn-sm edit-btn">Edit</button> `;
        displayedToDoItems += `<button type="button" class="btn btn-primary btn-sm delete-btn">Delete</button>`;
        displayedToDoItems += `${object.text}`;
        displayedToDoItems += `<br /><br />`;
      });
      toDoDiv.html(displayedToDoItems);
      completedDiv.html(displayedToDoItems);
    }
  };
})();

ToDo.addEvents();
