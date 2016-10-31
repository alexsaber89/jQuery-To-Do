"use strict";

let ToDo = (function() {
  let body = $("#body");
  let toDoDiv = $("#to-do");
  let toDoDivArray = [];
  let completedDiv = $("#completed");
  let completedDivArray = [];
  let addBtn = $("#add-btn");
  let userInput = $("#userInput");
  let uniqueID = 0;

  return {
    addEvents: function() {
      //Collect User Input event
      addBtn.on("click",ToDo.getUserInput);
      userInput.on("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode == 13) {
          ToDo.getUserInput();
        }
      });
      //Delete Button event
      body.on("click", function(event) {
        if ($(event.target).hasClass("delete-btn")) {
          let targetedToDoId = $(event.target).closest(".to-do-wrapper").attr("id");
          let array = "";
          let div = "";
          if ($(event.target).closest(".to-do-wrapper").parent().parent().attr("id") === "completed-container") {
            array = completedDivArray;
            div = completedDiv;
          } else {
            array = toDoDivArray;
            div = toDoDiv;
          }
          for (var i = 0; i < array.length; i++) {
            if (parseInt(array[i].id) === parseInt(targetedToDoId)) {
              let targetedToDoObject = array[i];
              array.splice(array.indexOf(targetedToDoObject),1);
              ToDo.displayUserToDoItems(array,div);
            }
          }
        }
      });
      //Edit Button event
      body.on("click", function(event) {
        if ($(event.target).hasClass("edit-btn")) {
          let targetedToDoId = $(event.target).closest(".to-do-wrapper").attr("id");
          for (var i = 0; i < toDoDivArray.length; i++) {
            if (parseInt(toDoDivArray[i].id) === parseInt(targetedToDoId)) {
                let targetedToDoObject = toDoDivArray[i];
                targetedToDoObject.text = userInput.val();
                ToDo.displayUserToDoItems(toDoDivArray,toDoDiv);
            }
          }
          userInput.val("");
        }
      });
      //Checkbox event
      body.on("change", function(event) {
        if ($(event.target).hasClass("checkbox")) {
          let targetedToDoId = $(event.target).closest(".to-do-wrapper").attr("id");
          for (var i = 0; i < toDoDivArray.length; i++) {
            if (parseInt(toDoDivArray[i].id) === parseInt(targetedToDoId)) {
                let targetedToDoObject = toDoDivArray[i];
                completedDivArray.push(targetedToDoObject);
                ToDo.displayUserToDoItems(completedDivArray,completedDiv);
                toDoDivArray.splice(toDoDivArray.indexOf(targetedToDoObject),1);
                $(event.target).closest(".to-do-wrapper").remove();
            }
          }
        }
      });
    },
    getUserInput: function(event) {
      if (userInput.val() !== "") {
        uniqueID++;
        let whichArray = "toDoDivArray";
        ToDo.setUserToDoObject(uniqueID,userInput.val(),whichArray);
        userInput.val("");
        userInput.focus();
      }
    },
    setUserToDoObject: function(uniqueID,userInput,whichArray) {
      var userToDoObject = {
        "id": uniqueID,
        "text": userInput
      };
      if (whichArray === "toDoDivArray") {
        toDoDivArray.push(userToDoObject);
      } else if(whichArray === "completedDivArray") {
        completedDivArray.push(userToDoObject);
      }
      ToDo.displayUserToDoItems(toDoDivArray,toDoDiv);
    },
    displayUserToDoItems: function(array,displayDiv) {
      let displayedToDoItems = "";
      array.forEach((object) => {
        displayedToDoItems += `<div id=${object.id} class="to-do-wrapper"> `;
        if (displayDiv === completedDiv) {
          displayedToDoItems += `<div class="checkbox-style"><label><input class="checkbox" type="checkbox" value="" checked></label></div>`;
        } else {
          displayedToDoItems += `<div class="checkbox-style"><label><input class="checkbox" type="checkbox" value=""></label></div>`;
          displayedToDoItems += `<button type="button" class="btn btn-primary btn-sm edit-btn">Edit</button> `;
        }
        displayedToDoItems += `<button type="button" class="btn btn-primary btn-sm delete-btn">Delete</button> `;
        displayedToDoItems += `<div class="to-do_text">${object.text}</div>`;
        displayedToDoItems += `<br />`;
        displayedToDoItems += `</div>`;
      });
      displayDiv.html(displayedToDoItems);
    }
  };
})();

ToDo.addEvents();
