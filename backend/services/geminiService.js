// const { GoogleGenerativeAI } = require('@google/generative-ai');

// // Initialize Gemini
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// /**
//  * Get AI recommendation for volunteer assignment
//  * @param {Object} disaster - Disaster details
//  * @param {Array} volunteers - List of available volunteers
//  * @returns {Object} AI recommendation with reasoning
//  */
// async function getVolunteerRecommendation(disaster, volunteers) {
//     // Prepare prompt for Gemini
//     const prompt = `
// You are an expert disaster response coordinator. Analyze this disaster and recommend the best volunteer type.

// DISASTER DETAILS:
// - Location: ${disaster.location}
// - Type: ${disaster.type}
// - Urgency: ${disaster.urgency}
// - People Affected: ${disaster.peopleAffected}

// AVAILABLE VOLUNTEERS:
// ${volunteers.map(v => `- ${v.name}: ${v.skills.join(', ')} (${v.reachTime} mins away)`).join('\n')}

// Based on the disaster type and urgency, provide:
// 1. Which skill type is most needed (${volunteers.map(v => v.skills[0]).filter((v,i,a)=>a.indexOf(v)===i).join(', ')} or other)
// 2. Priority level (1-10, where 10 is highest)
// 3. Recommended response time (in minutes)
// 4. Brief reasoning (2 sentences max)

// Return ONLY valid JSON in this format:
// {
//     "recommendedSkill": "skill_name",
//     "priority": number,
//     "recommendedResponseTime": number,
//     "reasoning": "text"
// }
// `;

//     try {
//         const result = await model.generateContent(prompt);
//         const response = result.response.text();
        
//         // Parse JSON from response
//         const jsonMatch = response.match(/\{[\s\S]*\}/);
//         if (jsonMatch) {
//             return JSON.parse(jsonMatch[0]);
//         }
//         return null;
//     } catch (error) {
//         console.error('Gemini API Error:', error);
//         return null;
//     }
// }

// /**
//  * Analyze disaster severity and get AI suggestions
//  */
// async function analyzeDisaster(disaster) {
//     const prompt = `
// Analyze this disaster situation and provide response strategy:

// - Type: ${disaster.type}
// - Urgency: ${disaster.urgency}  
// - People Affected: ${disaster.peopleAffected}

// Provide:
// 1. Required resources (3 items)
// 2. Immediate action (1 sentence)
// 3. Risk level (Low/Medium/High/Critical)

// Return JSON only:
// {
//     "requiredResources": ["item1", "item2", "item3"],
//     "immediateAction": "text",
//     "riskLevel": "level"
// }
// `;

//     try {
//         const result = await model.generateContent(prompt);
//         const response = result.response.text();
//         const jsonMatch = response.match(/\{[\s\S]*\}/);
//         return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
//     } catch (error) {
//         console.error('Gemini Analysis Error:', error);
//         return null;
//     }
// }
// async function chat(prompt) {
//     try {
//         const result = await model.generateContent(prompt);
//         const response = result.response.text();
//         return response.trim();
//     } catch (error) {
//         console.error('Chat Error:', error);
//         return "I'm having trouble responding right now. Please try again.";
//     }
// }

// module.exports = { getVolunteerRecommendation, analyzeDisaster,chat };

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini with correct model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

async function getVolunteerRecommendation(disaster, volunteers) {
    const prompt = `
You are an expert disaster response coordinator. Analyze this disaster and recommend the best volunteer type.

DISASTER DETAILS:
- Location: ${disaster.location}
- Type: ${disaster.type}
- Urgency: ${disaster.urgency}
- People Affected: ${disaster.peopleAffected}

AVAILABLE VOLUNTEERS:
${volunteers.map(v => `- ${v.name}: ${v.skills.join(', ')} (${v.reachTime} mins away)`).join('\n')}

Return ONLY valid JSON in this format:
{
    "recommendedSkill": "skill_name",
    "priority": number,
    "recommendedResponseTime": number,
    "reasoning": "text"
}`;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return null;
    } catch (error) {
        console.error('Gemini API Error:', error);
        return null;
    }
}

async function analyzeDisaster(disaster) {
    const prompt = `
Analyze this disaster situation and provide response strategy:

- Type: ${disaster.type}
- Urgency: ${disaster.urgency}  
- People Affected: ${disaster.peopleAffected}

Return JSON only:
{
    "requiredResources": ["item1", "item2", "item3"],
    "immediateAction": "text",
    "riskLevel": "level"
}`;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (error) {
        console.error('Gemini Analysis Error:', error);
        return null;
    }
}

async function chat(prompt) {
    try {
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        return response.trim();
    } catch (error) {
        console.error('Chat Error:', error);
        return "I'm having trouble responding right now. Please try again.";
    }
}

module.exports = { getVolunteerRecommendation, analyzeDisaster, chat };