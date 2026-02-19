namespace demo;

entity Authors {
  key ID : UUID;
  name   : String(111);
  born   : Date;
}

entity Books {
  key ID   : UUID;
  title    : String(255);
  genre    : String(50);
  stock    : Integer;
  price    : Decimal(9,2);
  authorID : UUID;
  author   : Association to Authors on author.ID = authorID;
}

service CatalogService {
  entity Books    as projection on demo.Books;
  entity Authors  as projection on demo.Authors;
}
