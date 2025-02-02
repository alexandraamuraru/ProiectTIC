const validateBook = (req, res, next) => {
    const { title, author, ISBN } = req.body;
    
    console.log(req.body)
    if (!title || !author || !ISBN) {
        return res.status(400).json({ 
            message: 'Title, author, and ISBN are required' 
        });
    }
    
    // const isbnRegex = /^(?:\d{10}|\d{13})$/;
    // if (!isbnRegex.test(ISBN)) {
    //     return res.status(400).json({ 
    //         message: 'Invalid ISBN format' 
    //     });
    // }

    next();
};

const validateLoan = (req, res, next) => {
    const { userId, bookId } = req.body;

    if (!userId || !bookId) {
        return res.status(400).json({ 
            message: 'User ID and Book ID are required' 
        });
    }

    next();
};

module.exports = {
    validateBook,
    validateLoan
};