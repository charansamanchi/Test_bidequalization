sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageBox",
  "sap/m/Dialog",
  "sap/m/Button",
  "sap/m/Label",
  "sap/m/Input",
  "sap/m/VBox"
], function(Controller, JSONModel, MessageBox, Dialog, Button, Label, Input, VBox) {
  "use strict";

  return Controller.extend("com.example.capm.authors.controller.AuthorListReport", {
    onInit: function() {
      this.getView().setModel(new JSONModel({
        Authors: [],
        count: 0,
        searchValue: ""
      }));
      
      this._loadAuthors();
      
      var oRouter = this.getOwnerComponent().getRouter();
      oRouter.getRoute("list").attachPatternMatched(this._onListMatched, this);
    },

    _onListMatched: function() {
      this._loadAuthors();
    },

    _loadAuthors: function() {
      var oModel = this.getView().getModel();
      
      fetch("/odata/v4/catalog/Authors?$orderby=name")
        .then(response => response.json())
        .then(data => {
          var authors = data.value || [];
          oModel.setProperty("/Authors", authors);
          oModel.setProperty("/count", authors.length);
        })
        .catch(error => {
          console.error("Error loading authors:", error);
          MessageBox.error("Failed to load authors: " + error.message);
        });
    },

    onSearch: function(oEvent) {
      var sQuery = oEvent.getParameter("query") || "";
      var oModel = this.getView().getModel();
      
      if (!sQuery) {
        this._loadAuthors();
        return;
      }
      
      var sFilter = "contains(name,'" + sQuery.replace(/'/g, "''") + "')";
      fetch("/odata/v4/catalog/Authors?$filter=" + encodeURIComponent(sFilter) + "&$orderby=name")
        .then(response => response.json())
        .then(data => {
          var authors = data.value || [];
          oModel.setProperty("/Authors", authors);
          oModel.setProperty("/count", authors.length);
        })
        .catch(error => {
          console.error("Error searching authors:", error);
          MessageBox.error("Search failed: " + error.message);
        });
    },

    onTableUpdateFinished: function() {
      // Table updated
    },

    onAuthorPress: function(oEvent) {
      var oContext = oEvent.getSource().getBindingContext();
      var oAuthor = oContext.getObject();
      
      var oRouter = this.getOwnerComponent().getRouter();
      oRouter.navTo("detail", { authorId: oAuthor.ID });
    },

    onCreateAuthor: function() {
      var that = this;
      var oNameInput = new Input("authorName", { placeholder: "Author Name" });
      var oBornInput = new Input("authorBorn", { type: "Date", placeholder: "Birth Date (YYYY-MM-DD)" });
      
      var oDialog = new Dialog({
        title: "Create Author",
        content: new VBox({
          items: [
            new Label({ text: "Name:" }),
            oNameInput,
            new Label({ text: "Birth Date:" }),
            oBornInput
          ],
          spacing: "1rem"
        }),
        buttons: [
          new Button({
            text: "Create",
            type: "Emphasized",
            press: function() {
              var sName = oNameInput.getValue();
              var sBorn = oBornInput.getValue();
              
              if (!sName || !sBorn) {
                MessageBox.error("Please fill in all fields");
                return;
              }
              
              fetch("/odata/v4/catalog/createAuthor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: sName, born: sBorn })
              })
                .then(response => response.json())
                .then(data => {
                  if (data.success) {
                    MessageBox.success("Author created successfully");
                    oDialog.close();
                    that._loadAuthors();
                  } else {
                    MessageBox.error("Failed to create author");
                  }
                })
                .catch(error => {
                  console.error("Error creating author:", error);
                  MessageBox.error("Error: " + error.message);
                });
            }
          }),
          new Button({
            text: "Cancel",
            press: function() {
              oDialog.close();
            }
          })
        ]
      });
      
      oDialog.open();
    }
  });
});
