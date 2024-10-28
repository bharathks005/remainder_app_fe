function addDaysToDate(date, daysToAdd) {
    const resultDate = new Date(date);
    resultDate.setDate(resultDate.getDate() + daysToAdd);
    return resultDate;
}

export default function validateDateTimePicker(date) {
    const minDate = new Date();
    const maxDate = addDaysToDate(minDate, 7);
    // Get the value of the input field
    const dateValue = new Date(date);

    if (!date) {
        return {
            isValid: false,
            error: "Please select a date and time."
        };
    }

    // Check if the input date is valid
    if (isNaN(dateValue.getTime())) {
        return {
            isValid: false,
            error: "Invalid date format. Please use the correct format."
        };
    }

    // Convert minDate and maxDate to Date objects if provided
    const min = minDate ? new Date(minDate) : null;
    const max = maxDate ? new Date(maxDate) : null;

    // Check if the date is within the specified range
    if (min && dateValue < min) {
        return {
            isValid: false,
            error: `The selected date is too early. Please select a date after ${min.toLocaleString()}.`
        };
    }

    if (max && dateValue > max) {
        return {
            isValid: false,
            error: `The selected date is too late. Please select a date before ${max.toLocaleString()}.`
        };
    }
    return {
        isValid: true,
        error: ''
    };
}