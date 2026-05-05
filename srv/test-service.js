const cds = require("@sap/cds");

class CatalogService extends cds.ApplicationService {
  async init() {
    const db = await cds.connect.to("db");

    /**
     * Action: deleteAuthor
     * Deletes an author by ID
     */
    this.on("deleteAuthor", async (req) => {
      const { ID } = req.data;
      try {
        await db.run(DELETE.from("demo.Authors").where({ ID }));
        return { success: true };
      } catch (error) {
        console.error("Error deleting author:", error);
        return { success: false };
      }
    });

    /**
     * Action: deleteBook
     * Deletes a book by ID
     */
    this.on("deleteBook", async (req) => {
      const { ID } = req.data;
      try {
        await db.run(DELETE.from("demo.Books").where({ ID }));
        return { success: true };
      } catch (error) {
        console.error("Error deleting book:", error);
        return { success: false };
      }
    });

    /**
     * Action: createAuthor
     * Creates a new author
     */
    this.on("createAuthor", async (req) => {
      const { name, born } = req.data;
      const { v4: uuid } = require("uuid");
      try {
        const newAuthor = {
          ID: uuid(),
          name,
          born
        };
        await db.run(INSERT.into("demo.Authors").entries(newAuthor));
        return { success: true };
      } catch (error) {
        console.error("Error creating author:", error);
        return { success: false };
      }
    });

    /**
     * Action: createBook
     * Creates a new book
     */
    this.on("createBook", "Authors", async (req) => {
      const author_ID = req.params[0].ID;
      const { title, genre, stock, price } = req.data;
      const { v4: uuid } = require("uuid");
      try {
        const newBook = {
          ID: uuid(),
          title,
          genre,
          stock,
          price,
          author_ID
        };
        await db.run(INSERT.into("demo.Books").entries(newBook));
        return { success: true };
      } catch (error) {
        console.error("Error creating book:", error);
        return { success: false };
      }
    });

    await super.init();
  }
}

module.exports = CatalogService;
