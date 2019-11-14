const BookstoreServices = {
    getAllBooks: (knex) => {
        return knex.select('*').from('books');
    },
    getBookById: (knex, chosenId) => {
        return knex.from('books').select('*').where({id: chosenId}).first()
    },
    getBookByGenre: (knex, chosenGenre) => {
        return knex.from('books').select('*').where({genre: chosenGenre})
    },
    postIntoBooks: (knex, newBook) => {
        return knex.insert(newBook).into('books').returning('*')
            .then(rows => {
                return({
                    ...rows[0],
                    year_published: Number(rows[0].year_published)
            })
                })
    },
    deleteBook: (knex, bookId) => {
        return knex.from('books').select('*').where({id: bookId}).delete()
    },
    updateBook: (knex, bookId, filedsToUpdate) => {
        return knex.from('books').select('*').where({id: bookId}).update(filedsToUpdate)
    }
};
module.exports = BookstoreServices;