import fs from 'fs';

try {
    const json = JSON.parse(fs.readFileSync('dashboard.json', 'utf8'));
    const criticalTickets = json.criticalTickets || [];

    console.log(`Total Tickets: ${criticalTickets.length}`);

    const searchQuery = '';

    const filteredTickets = criticalTickets.filter(ticket => {
        const score = ticket.sentiment?.score || 0;
        const isHighImpact = ticket.impact?.some(tag =>
            ['Revenue', 'SLA', 'Revenue Risk', 'High Priority'].includes(tag)
        );
        // Filter out Irrelevant tickets: 
        // - Must be Negative (1), Frustrated (2), or Neutral (3)
        // - OR have a High Impact tag
        // - Positive (4+) are excluded unless High Impact
        const isRelevant = (score > 0 && score <= 3) || isHighImpact;

        if (!isRelevant) {
            console.log(`Filtered out: ${ticket.ticket_id} (Score: ${score}, HighImpact: ${isHighImpact})`);
            return false;
        }

        // Apply Search Query
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            (ticket.summary || '').toLowerCase().includes(query) ||
            (ticket.ticket_id || '').toLowerCase().includes(query) ||
            (ticket.panel || '').toLowerCase().includes(query) ||
            (ticket.desc || '').toLowerCase().includes(query) ||
            (ticket.impact || []).some(tag => tag.toLowerCase().includes(query))
        );
    });

    console.log(`Filtered Tickets Count: ${filteredTickets.length}`);
    filteredTickets.forEach(t => {
        console.log(`- ${t.ticket_id}: ${t.summary}`);
    });

} catch (e) {
    console.error(e);
}
