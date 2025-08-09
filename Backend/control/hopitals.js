const Hospital = require("../model/hospitals");

// Fetches all unique state names, case-insensitively.
exports.getStates = async (req, res) => {
    try {
        const states = await Hospital.distinct('state');
        res.status(200).json(states);
    } catch (error) {
        console.error('Error fetching states:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Fetches unique district names for a given state, case-insensitively.
exports.getDistricts = async (req, res) => {
    const { state } = req.body;
    if (!state) {
        return res.status(400).json({ message: 'State is required' });
    }
    try {
        // Trim whitespace from the input for a more robust query
        const trimmedState = state.trim();
        const districts = await Hospital.distinct('district', { state: { $regex: new RegExp(`^${trimmedState}$`, 'i') } });
        res.status(200).json(districts);
    } catch (error) { // Corrected: Added missing opening brace
        console.error('Error fetching districts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Fetches all hospitals for a given state and district, case-insensitively.
exports.getHospitals = async (req, res) => {
    const { state, district } = req.body;
    if (!state || !district) {
        return res.status(400).json({ message: 'State and district are required' });
    }

    // Add this log to see exactly what the backend is receiving.
    console.log(`Received request for State: "${state}", District: "${district}"`);

    try {
        // Trim whitespace from inputs for a more robust query
        const trimmedState = state.trim();
        const trimmedDistrict = district.trim();

        const query = {
            state: { $regex: new RegExp(`^${trimmedState}$`, 'i') },
            district: { $regex: new RegExp(`^${trimmedDistrict}$`, 'i') }
        };

        // Add this log to see the exact query being sent to MongoDB.
        console.log("Executing MongoDB query:", JSON.stringify(query));

        const hospitals = await Hospital.find(query);
        
        console.log(`Found ${hospitals.length} hospitals.`);
        
        res.status(200).json(hospitals);
    } catch (error) {
        console.error('Error fetching hospitals:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
