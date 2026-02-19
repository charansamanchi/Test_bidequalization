sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/routing/History",
  "sap/m/MessageBox"
], function(Controller, History, MessageBox) {
  "use strict";

  return Controller.extend("app.controller.Main", {
    onInit: function() {
      var oRouter = this.getRouter();
      console.log("Main controller initialized, router:", oRouter);
      oRouter.attachRouteMatched(this._onRouteMatched, this);
    },

    _onRouteMatched: function(oEvent) {
      var sRouteName = oEvent.getParameter("name");
      console.log("Route matched: " + sRouteName);
      if (sRouteName === "authors") {
        this._loadAuthors();
      } else if (sRouteName === "books") {
        var authorId = oEvent.getParameter("arguments").id;
        console.log("Loading books for author: " + authorId);
        this._loadBooksByAuthor(authorId);
      }
    },

    _loadAuthors: function() {
      var oViewModel = this.getView().getModel("view");
      console.log("Loading authors...");
      
      fetch("/odata/v4/catalog/Authors")
        .then(function(response) {
          console.log("Fetch response status:", response.status);
          if (!response.ok) {
            throw new Error("HTTP error, status = " + response.status);
          }
          return response.json();
        })
        .then(function(oData) {
          console.log("Full response object:", oData);
          console.log("oData.value:", oData.value);
          console.log("oData.value length:", oData.value ? oData.value.length : "undefined");
          if (oData && oData.value && oData.value.length > 0) {
            console.log("Setting authors in view model");
            oViewModel.setProperty("/authors", oData.value);
            oViewModel.refresh(true);
            console.log("View model updated and refreshed. Authors:", oViewModel.getProperty("/authors"));
          } else {
            console.warn("No authors found in response");
          }
        }.bind(this))
        .catch(function(oError) {
          var sMsg = "Error loading authors: " + (oError.message || "Unknown error");
          console.error(sMsg);
          console.error("Full error:", oError);
          MessageBox.error(sMsg);
        });
    },

    _loadBooksByAuthor: function(authorId) {
      var oViewModel = this.getView().getModel("view");
      
      var sUrl = "/odata/v4/catalog/Books?$filter=authorID eq '" + authorId + "'";
      console.log("Loading books with URL: " + sUrl);
      
      fetch(sUrl)
        .then(function(response) {
          console.log("Books fetch response status:", response.status);
          if (!response.ok) {
            throw new Error("HTTP error, status = " + response.status);
          }
          return response.json();
        })
        .then(function(oData) {
          console.log("Books loaded:", oData);
          console.log("Books value:", oData.value);
          if (oData && oData.value) {
            console.log("Setting books in view model, count:", oData.value.length);
            oViewModel.setProperty("/books", oData.value);
            oViewModel.refresh(true);
            console.log("Books view model updated and refreshed");
          } else {
            console.warn("No books found in response");
          }
        }.bind(this))
        .catch(function(oError) {
          var sMsg = "Error loading books: " + (oError.message || "Unknown error");
          console.error(sMsg);
          console.error("Full error:", oError);
          MessageBox.error(sMsg);
        });
    },

    onAuthorPress: function(oEvent) {
      console.log("onAuthorPress fired!");
      var oListItem = oEvent.getParameter("listItem");
      console.log("List item:", oListItem);
      var oContext = oListItem.getBindingContext("view");
      console.log("Binding context:", oContext);
      if (!oContext) {
        console.error("No binding context found");
        MessageBox.error("No binding context found");
        return;
      }
      var authorId = oContext.getProperty("ID");
      console.log("Author clicked with ID: " + authorId);
      this.getRouter().navTo("books", { id: authorId });
    },

    onNavBack: function() {
      var oPrevHash = History.getInstance().getPreviousHash();
      if (oPrevHash !== undefined) {
        window.history.back();
      } else {
        this.getRouter().navTo("authors");
      }
    },

    getRouter: function() {
      return sap.ui.core.UIComponent.getRouterFor(this);
    }
  });
});
