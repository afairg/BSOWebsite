const express = require('express');
const cors = require('cors');
const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

app.get('/api/events', (req, res) => {
    // Sample data - in a real application, this would come from a database
    const events = [
        { id: 1, title: 'Event One', date: '2025-12-11', description: 'Description for Event One', location: 'Wattenbarger Auditorium' },
        { id: 2, title: 'Event Two', date: '2025-12-12', description: 'Description for Event Two', location: 'Wattenbarger Auditorium' },
        { id: 3, title: 'Event Three', date: '2025-12-13', description: 'Description for Event Three', location: 'Wattenbarger Auditorium' }
    ];
    res.status(200).json({
        status: 'success',
        results: events
    });

})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})