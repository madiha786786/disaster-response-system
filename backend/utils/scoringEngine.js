const haversineDistance = (coords1, coords2) => {
    if (!coords1 || !coords2) return 50; // Default distance
    
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Earth's radius in km
    
    const dLat = toRad(coords2.lat - coords1.lat);
    const dLon = toRad(coords2.lng - coords1.lng);
    const lat1 = toRad(coords1.lat);
    const lat2 = toRad(coords2.lat);
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
};

const calculateSkillMatch = (volunteerSkills, disasterType) => {
    if (volunteerSkills.includes(disasterType)) return 50;
    if (disasterType === 'rescue' && volunteerSkills.includes('flood')) return 35;
    if (disasterType === 'medical' && volunteerSkills.includes('rescue')) return 30;
    return 20;
};

const calculateDistanceScore = (volunteerCoords, disasterCoords) => {
    const distance = haversineDistance(volunteerCoords, disasterCoords);
    let score = 30;
    
    if (distance <= 5) score = 30;
    else if (distance <= 10) score = 25;
    else if (distance <= 20) score = 20;
    else if (distance <= 35) score = 15;
    else if (distance <= 50) score = 10;
    else score = 5;
    
    return { score, distance };
};

const calculateAvailabilityScore = (availability, reachTime) => {
    if (availability !== 'free') return 5;
    
    let score = 20;
    if (reachTime <= 15) score += 5;
    else if (reachTime <= 30) score += 3;
    else if (reachTime <= 60) score += 1;
    
    return Math.min(25, score);
};

const calculateExperienceScore = (totalMissions, rating) => {
    let score = 0;
    if (totalMissions > 50) score += 15;
    else if (totalMissions > 20) score += 10;
    else if (totalMissions > 5) score += 5;
    
    score += (rating - 3) * 2.5;
    return Math.max(0, Math.min(15, score));
};

const calculateTotalScore = (volunteer, disaster) => {
    const skillMatch = calculateSkillMatch(volunteer.skills, disaster.type);
    const distanceResult = calculateDistanceScore(volunteer.coordinates, disaster.coordinates);
    const availabilityScore = calculateAvailabilityScore(volunteer.availability, volunteer.reachTime);
    const experienceScore = calculateExperienceScore(volunteer.totalMissions, volunteer.rating);
    
    const total = skillMatch + distanceResult.score + availabilityScore + experienceScore;
    
    return {
        total: Math.round(total),
        skillMatch,
        distanceScore: distanceResult.score,
         distance: distanceResult.distance || 5,
        availabilityScore,
        experienceScore
    };
};

module.exports = {
    calculateTotalScore,
    haversineDistance
};