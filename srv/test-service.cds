namespace demo;

entity Authors {
  key ID : UUID;
  name   : String(111) @title: 'Author Name';
  born   : Date @title: 'Birth Date';
  books  : Association to many Books on books.author = $self;
}

entity Books {
  key ID : UUID;
  title : String(255) @title: 'Book Title';
  genre : String(50) @title: 'Genre';
  stock : Integer @title: 'Stock Quantity';
  price : Decimal(9,2) @title: 'Price (USD)';
  author_ID : UUID;
  author : Association to Authors on author.ID = author_ID;
}

service CatalogService {
  
  @(
    UI: {
      HeaderInfo: {
        TypeName: 'Author',
        TypeNamePlural: 'Authors',
        Title: {Value: name},
        Description: {Value: born}
      },
      SelectionFields: [name],
      LineItem: [
        {Value: name},
        {Value: born}
      ],
      PresentationVariant: {
        SortOrder: [{Property: name, Descending: false}],
        Visualizations: ['@UI.LineItem']
      },
      FieldGroup #Main: {
        Data: [
          {Value: name},
          {Value: born}
        ]
      },
      Facets: [
        {
          $Type: 'UI.ReferenceFacet',
          ID: 'GeneralInformation',
          Label: 'General Information',
          Target: '@UI.FieldGroup#Main'
        },
        {
          $Type: 'UI.ReferenceFacet',
          ID: 'AuthorBooks',
          Label: 'Books',
          Target: 'books/@UI.LineItem'
        }
      ]
    }
  )
  entity Authors as projection on demo.Authors {
    *
  };

  @(
    UI: {
      HeaderInfo: {
        TypeName: 'Book',
        TypeNamePlural: 'Books',
        Title: {Value: title},
        Description: {Value: genre}
      },
      SelectionFields: [title, genre],
      LineItem: [
        {Value: title},
        {Value: genre},
        {Value: stock},
        {Value: price},
        {
          $Type: 'UI.DataFieldForAction',
          Action: 'CatalogService.deleteBook',
          Label: 'Delete'
        }
      ],
      PresentationVariant: {
        SortOrder: [{Property: title, Descending: false}],
        Visualizations: ['@UI.LineItem']
      },
      FieldGroup #Main: {
        Data: [
          {Value: title},
          {Value: genre},
          {Value: stock},
          {Value: price}
        ]
      },
      Facets: [
        {
          $Type: 'UI.ReferenceFacet',
          ID: 'BookInfo',
          Label: 'Book Details',
          Target: '@UI.FieldGroup#Main'
        }
      ]
    }
  )
  entity Books as projection on demo.Books {
    *,
    author
  };

  action deleteAuthor(ID: UUID) returns {success: Boolean};
  action deleteBook(ID: UUID) returns {success: Boolean};
  action createAuthor(name: String, born: Date) returns {success: Boolean};
  action createBook(title: String, genre: String, stock: Integer, price: Decimal, author_ID: UUID) returns {success: Boolean};
}


