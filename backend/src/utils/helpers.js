const calculateDueDate = (borrowDate, durationInDays = 14) => {
    const date = new Date(borrowDate);
    date.setDate(date.getDate() + durationInDays);
    return date;
};

const calculateFine = (dueDate, returnDate, finePerDay = 0.50) => {
    const due = new Date(dueDate);
    const returned = returnDate ? new Date(returnDate) : new Date();
    
    if (returned <= due) return 0;
    
    const diffTime = Math.abs(returned - due);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays * finePerDay;
};

module.exports = {
    calculateDueDate,
    calculateFine
};