module.exports = {
    formatReadableDateTime(isoDateString) {
        // Parse the ISO 8601 date string
        const date = new Date(isoDateString);

        // Format options for date
        const dateOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        };

        // Format options for time
        const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
        };

        // Get formatted date and time separately
        const readableDate = date.toLocaleDateString('en-US', dateOptions);
        const readableTime = date.toLocaleTimeString('en-US', timeOptions);

        // Concatenate date and time
        const readableDateTime = `${readableDate}, ${readableTime}`;
        return readableDateTime;
    }
}