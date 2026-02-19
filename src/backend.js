/**
 * Support Intel - Backend Service (Google Apps Script)
 * Final production version reading from real Google Sheets tabs.
 */

function getSheet(name) {
    return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
}

function toBool(val) {
    return val === true || String(val).toLowerCase() === 'true';
}

function safeDate(val) {
    try {
        const d = new Date(val);
        return isNaN(d.getTime()) ? null : d;
    } catch (e) {
        return null;
    }
}

function formatDate(val) {
    const d = safeDate(val);
    return d ? Utilities.formatDate(d, "GMT+5:30", "yyyy-MM-dd") : '';
}

function formatTime(val) {
    const d = safeDate(val);
    return d ? Utilities.formatDate(d, "GMT+5:30", "hh:mm a") : '08:00 AM';
}

// ── MAIN ROUTER ────────────────────────────────────────────

function doGet(e) {
    const action = e.parameter.action;

    try {
        let result;

        switch (action) {
            case 'getDashboard':
                result = getDashboardData();
                break;
            case 'getTrends':
                result = { trends: getTrendData() };
                break;
            case 'getQualityData':
                result = getQualityData();
                break;
            case 'getMetrics':
                result = { metrics: getMetricData() };
                break;
            case 'getKB':
                result = getKnowledgeBaseData();
                break;
            default:
                result = { error: 'Invalid action: ' + action };
        }

        return ContentService
            .createTextOutput(JSON.stringify(result))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        Logger.log('API Error: ' + error.toString());
        return ContentService
            .createTextOutput(JSON.stringify({ error: error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// ── DASHBOARD ──────────────────────────────────────────────

function getDashboardData() {

    // 1. Daily Brief
    const briefSheet = getSheet('Daily_Brief(SI)');
    const briefRow = briefSheet.getLastRow() >= 2
        ? briefSheet.getRange(2, 1, 1, 5).getValues()[0]
        : ['', '', '', '', ''];

    const briefText = briefRow[0]
        ? briefRow[0].split('\n').filter(Boolean).map(line => ({ text: line.trim() }))
        : [];

    // 2. Risk Scores
    const riskSheet = getSheet('Risk_Scores(SI)');
    const riskRows = riskSheet.getLastRow() >= 2
        ? riskSheet.getRange(2, 1, riskSheet.getLastRow() - 1, 4).getValues()
        : [];

    const riskScores = riskRows
        .filter(row => row[0] !== '')
        .map(row => {
            const score = Number(row[1]);
            const score24h = Number(row[2]);
            const hasJumped = (score - score24h) > 20;

            return {
                name: row[0],
                score: score,
                score24hAgo: score24h,
                level: score > 70 ? 'High Risk' : score > 40 ? 'Elevated' : 'Nominal',
                description: hasJumped
                    ? 'Risk jumped >20pts in last 24h.'
                    : score > 70 ? 'High volume of critical tickets.'
                        : score > 40 ? 'Moderate issues detected.'
                            : 'Status within expected parameters.',
                color: score > 70
                    ? 'border-l-red-500'
                    : score > 40 ? 'border-l-amber-500'
                        : 'border-l-emerald-500',
                hasJumped: hasJumped
            };
        });

    // 3. Critical Tickets
    const ticketsSheet = getSheet('Daily');
    const sentimentSheet = getSheet('Sentiment_Analysis(SI)');

    const ticketRows = ticketsSheet.getLastRow() >= 2
        ? ticketsSheet.getRange(2, 1, ticketsSheet.getLastRow() - 1, 7).getValues()
        : [];

    const sentimentRows = sentimentSheet.getLastRow() >= 2
        ? sentimentSheet.getRange(2, 1, sentimentSheet.getLastRow() - 1, 7).getValues()
        : [];

    // Build sentiment lookup map
    const sentimentMap = {};
    sentimentRows.forEach(row => {
        if (row[0] !== '') sentimentMap[String(row[0])] = row;
    });

    const now = new Date();

    const criticalTickets = ticketRows
        .filter(row => {
            if (row[0] === '') return false;
            const resolved = toBool(row[3]);
            if (resolved) return false;
            const sentiment = sentimentMap[String(row[0])];
            const score = sentiment ? Number(sentiment[1]) : 10;
            return score <= 3;
        })
        .map(row => {
            const ticketId = String(row[0]);
            const sentiment = sentimentMap[ticketId];
            const ticketDate = safeDate(row[5]);
            const agingMs = ticketDate ? now - ticketDate : 0;
            const agingHours = Math.floor(agingMs / (1000 * 60 * 60));
            const agingDays = Math.floor(agingHours / 24);

            return {
                ticket_id: ticketId,
                summary: row[1],
                panel: row[2],
                resolved: false,
                ikc_found: toBool(row[4]),
                date: formatDate(row[5]),
                aging: agingDays > 0 ? agingDays + 'd' : agingHours + 'h',
                agingColor: agingHours > 48 ? 'red' : agingHours > 24 ? 'amber' : 'slate',
                sentiment: {
                    score: sentiment ? Number(sentiment[1]) : 0,
                    label: sentiment
                        ? (Number(sentiment[1]) <= 3 ? 'Highly Frustrated'
                            : Number(sentiment[1]) <= 5 ? 'Frustrated'
                                : 'Neutral')
                        : 'Unknown',
                    keywords: sentiment
                        ? String(sentiment[2]).split(',').map(k => k.trim()).filter(Boolean)
                        : []
                },
                ai_reasoning: sentiment ? String(sentiment[6]) : '',
                impact: [
                    sentiment && toBool(sentiment[3]) ? 'Revenue Risk' : null,
                    sentiment && toBool(sentiment[4]) ? 'SLA Risk' : null,
                    sentiment && toBool(sentiment[5]) ? 'Reputation Risk' : null
                ].filter(Boolean)
            };
        })
        .slice(0, 10);

    return {
        dailyBrief: briefText,
        riskScores: riskScores,
        criticalTickets: criticalTickets,
        metrics: getMetricData(),
        generatedAt: formatTime(briefRow[4])
    };
}

// ── METRICS ────────────────────────────────────────────────

function getMetricData() {
    const sheet = getSheet('Daily_Metrics(SI)');
    const lastRow = sheet.getLastRow();

    if (lastRow < 2) {
        return [
            { label: 'Total Tickets', value: 0, trend: '0', trendDirection: 'stable', status: 'neutral', sparklineData: '0', sparklineColor: '#135bec' },
            { label: 'Resolved %', value: '0%', trend: '0%', trendDirection: 'stable', status: 'neutral', sparklineData: '0', sparklineColor: '#10b981' },
            { label: 'Critical Load', value: 0, trend: '0', trendDirection: 'stable', status: 'neutral', sparklineData: '0', sparklineColor: '#ef4444' },
            { label: 'Avg Sentiment', value: '5.0', trend: '0', trendDirection: 'stable', status: 'neutral', sparklineData: '5', sparklineColor: '#f59e0b' }
        ];
    }

    // Get last 7 rows for sparklines
    const startRow = Math.max(2, lastRow - 6);
    const numRows = lastRow - startRow + 1;
    const data = sheet.getRange(startRow, 1, numRows, 5).getValues()
        .filter(r => r[0] !== '');

    const today = data[data.length - 1];
    const yesterday = data.length > 1 ? data[data.length - 2] : today;

    const getDelta = (curr, prev) => {
        const d = Number(curr) - Number(prev);
        return d > 0 ? '+' + d : String(d);
    };

    const getDirection = (curr, prev) => {
        if (Number(curr) > Number(prev)) return 'up';
        if (Number(curr) < Number(prev)) return 'down';
        return 'stable';
    };

    const resolvedPctToday = today[1] > 0
        ? ((today[2] / today[1]) * 100).toFixed(0)
        : 0;

    const resolvedPctYesterday = yesterday[1] > 0
        ? ((yesterday[2] / yesterday[1]) * 100).toFixed(0)
        : 0;

    const resolvedDelta = (Number(resolvedPctToday) - Number(resolvedPctYesterday)).toFixed(1);

    return [
        {
            label: 'Total Tickets',
            value: today[1],
            trend: getDelta(today[1], yesterday[1]),
            trendDirection: getDirection(today[1], yesterday[1]),
            status: today[1] > yesterday[1] ? 'warning' : 'success',
            sparklineData: data.map(r => r[1]).join(','),
            sparklineColor: '#135bec'
        },
        {
            label: 'Resolved %',
            value: resolvedPctToday + '%',
            trend: (resolvedDelta > 0 ? '+' : '') + resolvedDelta + '%',
            trendDirection: getDirection(resolvedPctToday, resolvedPctYesterday),
            status: Number(resolvedPctToday) >= 80 ? 'success' : 'warning',
            sparklineData: data.map(r => r[1] > 0 ? ((r[2] / r[1]) * 100).toFixed(0) : 0).join(','),
            sparklineColor: '#10b981'
        },
        {
            label: 'Critical Load',
            value: today[3],
            trend: getDelta(today[3], yesterday[3]),
            trendDirection: getDirection(today[3], yesterday[3]),
            status: today[3] > yesterday[3] ? 'error' : 'success',
            sparklineData: data.map(r => r[3]).join(','),
            sparklineColor: '#ef4444'
        },
        {
            label: 'Avg Sentiment',
            value: Number(today[4]).toFixed(1),
            trend: getDelta(Number(today[4]).toFixed(1), Number(yesterday[4]).toFixed(1)),
            trendDirection: getDirection(today[4], yesterday[4]),
            status: Number(today[4]) >= 5 ? 'success' : 'warning',
            sparklineData: data.map(r => Number(r[4]).toFixed(1)).join(','),
            sparklineColor: '#f59e0b'
        }
    ];
}

// ── TRENDS ─────────────────────────────────────────────────

function getTrendData() {
    const sheet = getSheet('Trends_Cache(SI)');
    if (sheet.getLastRow() < 2) return [];

    const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 11).getValues()
        .filter(row => row[0] !== '');

    return data.map(row => ({
        trend_id: String(row[0]),
        title: row[1],
        state: row[2],
        ticket_count: Number(row[3]),
        ticket_ids: String(row[4]).split(',').map(s => s.trim()).filter(Boolean),
        root_cause: row[5],
        confidence: Math.round(Number(row[6]) * 100),
        needs_escalation: toBool(row[7]),
        growth_percentage: Number(row[8]),
        first_seen: formatDate(row[9]),
        last_seen: formatDate(row[10])
    }));
}

// ── QUALITY & COACHING ─────────────────────────────────────

function getQualityData() {

    // 1. Coaching from Daily_Brief
    const briefSheet = getSheet('Daily_Brief(SI)');
    const briefRow = briefSheet.getLastRow() >= 2
        ? briefSheet.getRange(2, 1, 1, 5).getValues()[0]
        : ['', '', '', '', ''];

    const sentimentSheet = getSheet('Sentiment_Analysis(SI)');
    const sentimentRows = sentimentSheet.getLastRow() >= 2
        ? sentimentSheet.getRange(2, 1, sentimentSheet.getLastRow() - 1, 7).getValues()
            .filter(r => r[0] !== '' && r[1] !== '')
        : [];

    const scores = sentimentRows.map(r => Number(r[1])).filter(n => !isNaN(n) && n > 0);
    const avgScore = scores.length > 0
        ? scores.reduce((a, b) => a + b, 0) / scores.length
        : 5;

    const qualityScore = Math.round((avgScore / 10) * 100);

    // Read 7 columns now (added Redundant_Reply_Count)
    const signalsSheet = getSheet('Quality_Signals(SI)');
    const signalRows = signalsSheet.getLastRow() >= 2
        ? signalsSheet.getRange(2, 1, signalsSheet.getLastRow() - 1, 7).getValues()
            .filter(r => r[0] !== '')
        : [];

    // Sum column C (index 2) for total redundant count - FILTERED BY LATEST AVAILABLE DATE
    // (Since data updates at 6 PM, we use the latest date found in the sheet)
    let latestDateStr = "";
    const dates = signalRows.map(r => formatDate(r[6])).filter(d => d).sort();
    if (dates.length > 0) {
        latestDateStr = dates[dates.length - 1];
    }

    // Fallback: If no date found, use today
    if (!latestDateStr) {
        latestDateStr = Utilities.formatDate(new Date(), "GMT+5:30", "yyyy-MM-dd");
    }

    const redundantCount = signalRows
        .filter(r => formatDate(r[6]) === latestDateStr)
        .reduce((sum, r) => sum + (Number(r[2]) || 0), 0);

    // Updated column indexes (D=3, E=4, F=5, G=6)
    const processFlagged = signalRows
        .filter(r => {
            const drop = Number(r[4]) - Number(r[5]); // E - F (higher = more frustrated)
            return drop >= 3 || String(r[1]) === 'Churn Risk';
        })
        .map(r => ({
            id: String(r[0]),
            signal_type: r[1],                          // B
            redundant_count: Number(r[2]) || 0,         // C
            description: r[3],                          // D
            sentiment_before: Number(r[4]),             // E
            sentiment_after: Number(r[5]),              // F
            flagged_date: formatDate(r[6]),             // G
            advice: 'Sentiment went from ' + r[4] + ' to ' + r[5] +
                ' after support reply. Investigate reply quality.'
        }))
        .slice(0, 10);

    return {
        qualitySignals: {
            score: qualityScore,
            redundant_replies: redundantCount,
            process_flagged: processFlagged
        },
        coaching: {
            win: briefRow[1] || 'Analysis pending',
            risk: briefRow[2] || 'Analysis pending',
            action: briefRow[3] || 'Analysis pending'
        }
    };
}

// ── KNOWLEDGE BASE ────────────────────────────────────────

function getKnowledgeBaseData() {
    const kbSheet = getSheet('testkb');
    const faqSheet = getSheet('testfaqs'); // confirm your tab name

    const kbRows = kbSheet.getLastRow() >= 2
        ? kbSheet.getDataRange().getValues().slice(1).filter(r => r[0] !== '')
        : [];

    const faqRows = faqSheet.getLastRow() >= 2
        ? faqSheet.getDataRange().getValues().slice(1).filter(r => r[0] !== '')
        : [];

    const articles = kbRows.map(row => ({
        kb_id: row[0],
        title: row[1],
        problem_statement: row[2],
        resolution_steps: row[3],
        keywords: String(row[4]).split(',').map(s => s.trim()).filter(Boolean),
        panels_affected: String(row[7]).split(',').map(s => s.trim()).filter(Boolean),
        priority_score: Number(row[8]),
        priority_level: row[9],
        frequency: Number(row[6])
    }));

    const faqs = faqRows.map(row => ({
        question: row[1],
        answer: row[2],
        panel: row[3],
        keywords: String(row[4]).split(',').map(s => s.trim()).filter(Boolean)
    }));

    return { articles, faqs };
}