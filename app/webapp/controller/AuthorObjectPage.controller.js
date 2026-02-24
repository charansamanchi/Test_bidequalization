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

  return Controller.extend("com.example.capm.authors.controller.AuthorObjectPage", {
    onInit: function() {
      this.getView().setModel(new JSONModel({
        author: {},
        books: []
      }));
      
      var oRouter = this.getOwnerComponent().getRouter();
      oRouter.getRoute("detail").attachPatternMatched(this._onRouteMatched, this);
    },

    _onRouteMatched: function(oEvent) {
      var sAuthorId = oEvent.getParameter("arguments").authorId;
      this._loadAuthorDetail(sAuthorId);
    },

    _loadAuthorDetail: function(sAuthorId) {
      var oModel = this.getView().getModel();
      // Load author details
      fetch("/odata/v4/catalog/Authors('" + sAuthorId + "')")
        .then(response => response.json())
        .then(data => {
          oModel.setProperty("/author", data);
          
          // Load related books
          return fetch("/odata/v4/catalog/Authors('" + sAuthorId + "')/books");
        })
        .then(response => response.json().then(data => { debugger; return data; }))
        .then(data => {
          var books = data.value || [];
          oModel.setProperty("/books", books);
        })
        .catch(error => {
          console.error("Error loading author:", error);
          MessageBox.error("Failed to load author: " + error.message);
        });
    },

    onNavBack: function() {
      var oRouter = this.getOwnerComponent().getRouter();
      oRouter.navTo("list");
    },

    onDeleteAuthor: function() {
      var that = this;
      var oModel = this.getView().getModel();
      var oAuthor = oModel.getProperty("/author");
      
      MessageBox.confirm("Delete author '" + oAuthor.name + "'?", {
        onClose: function(sAction) {
          if (sAction === MessageBox.Action.OK) {
            fetch("/odata/v4/catalog/deleteAuthor", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ID: oAuthor.ID })
            })
              .then(response => response.json())
              .then(data => {
                if (data.success) {
                  MessageBox.success("Author deleted successfully");
                  that.onNavBack();
                } else {
                  MessageBox.error(data.error || "Failed to delete author");
                }
              })
              .catch(error => {
                console.error("Error deleting author:", error);
                MessageBox.error("Error: " + error.message);
              });
          }
        }
      });
    },

    onDeleteBook: function(oEvent) {
      var that = this;
      var oModel = this.getView().getModel();
      var oAuthor = oModel.getProperty("/author");
      var oContext = oEvent.getSource().getBindingContext();
      var oBook = oContext.getObject();
      
      MessageBox.confirm("Delete book '" + oBook.title + "'?", {
        onClose: function(sAction) {
          if (sAction === MessageBox.Action.OK) {
            fetch("/odata/v4/catalog/deleteBook", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ID: oBook.ID })
            })
              .then(response => response.json())
              .then(data => {
                if (data.success) {
                  MessageBox.success("Book deleted successfully");
                  that._loadAuthorDetail(oAuthor.ID);
                } else {
                  MessageBox.error(data.error || "Failed to delete book");
                }
              })
              .catch(error => {
                console.error("Error deleting book:", error);
                MessageBox.error("Error: " + error.message);
              });
          }
        }
      });
    },

    onAddBook: function() {
      var that = this;
      var oModel = this.getView().getModel();
      var oAuthor = oModel.getProperty("/author");
      
      var oTitleInput = new Input("bookTitle", { placeholder: "Book Title" });
      var oGenreInput = new Input("bookGenre", { placeholder: "Genre" });
      var oStockInput = new Input("bookStock", { type: "Number", placeholder: "Stock" });
      var oPriceInput = new Input("bookPrice", { type: "Number", placeholder: "Price" });
      
      var oDialog = new Dialog({
        title: "Add Book",
        content: new VBox({
          items: [
            new Label({ text: "Title:" }),
            oTitleInput,
            new Label({ text: "Genre:" }),
            oGenreInput,
            new Label({ text: "Stock:" }),
            oStockInput,
            new Label({ text: "Price:" }),
            oPriceInput
          ],
          spacing: "1rem"
        }),
        buttons: [
          new Button({
            text: "Add",
            type: "Emphasized",
            press: function() {
              var sTitle = oTitleInput.getValue();
              var sGenre = oGenreInput.getValue();
              var iStock = parseInt(oStockInput.getValue()) || 0;
              var fPrice = parseFloat(oPriceInput.getValue()) || 0;
              
              if (!sTitle || !sGenre) {
                MessageBox.error("Please fill in Title and Genre");
                return;
              }
              
              fetch("/odata/v4/catalog/createBook", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  title: sTitle,
                  genre: sGenre,
                  stock: iStock,
                  price: fPrice,
                  author_ID: oAuthor.ID
                })
              })
                .then(response => response.json())
                .then(data => {
                  if (data.success) {
                    MessageBox.success("Book created successfully");
                    oDialog.close();
                    that._loadAuthorDetail(oAuthor.ID);
                  } else {
                    MessageBox.error(data.error || "Failed to create book");
                  }
                })
                .catch(error => {
                  console.error("Error creating book:", error);
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
