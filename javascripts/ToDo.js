"use strict";

let ToDo = (function() {
  let toDoDiv = $("#to-do");
  let completedDiv = $("#completed");
  let addBtn = $("#add-btn");
  let userInput = "";
  let toDoItemsArray = [];
  let uniqueID = 0;

  return {
    addEvents: function() {
      addBtn.on("click",ToDo.getUserInput);
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
      toDoItemsArray.push(userToDoObject);
      console.log("toDoItemsArray: ",toDoItemsArray);
      ToDo.displayUserMessages();
    },
    displayUserMessages: function() {
      toDoItemsArray.forEach((object) => {
        console.log(object.text);
      });
    }
  };
})();

ToDo.addEvents();
