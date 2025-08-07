// Log Viewer Utility for Manufacturing Compliance
class LogViewer {
    constructor() {
        this.logTypes = {
            'application': 'Application Logs',
            'audit': 'Audit Trail',
            'security': 'Security Events',
            'vendor': 'Vendor Activity',
            'performance': 'Performance Metrics',
            'error': 'Error Logs'
        };
    }

    // Parse log entry from JSON string
    parseLogEntry(logLine) {
        try {
            // Extract timestamp and message
            const match = logLine.match(/^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) \| (\w+) \| (\w+) \| (.+)$/);
            if (match) {
                const [, timestamp, logger, level, message] = match;
                
                // Try to parse JSON message
                let parsedMessage = message;
                try {
                    parsedMessage = JSON.parse(message);
                } catch (e) {
                    // If not JSON, keep as string
                }
                
                return {
                    timestamp: new Date(timestamp),
                    logger,
                    level: level.toLowerCase(),
                    message: parsedMessage,
                    raw: logLine
                };
            }
            return null;
        } catch (error) {
            console.error('Error parsing log entry:', error);
            return null;
        }
    }

    // Filter logs by criteria
    filterLogs(logs, filters = {}) {
        return logs.filter(log => {
            if (!log) return false;
            
            // Filter by level
            if (filters.level && log.level !== filters.level.toLowerCase()) {
                return false;
            }
            
            // Filter by logger
            if (filters.logger && log.logger !== filters.logger) {
                return false;
            }
            
            // Filter by date range
            if (filters.startDate && log.timestamp < filters.startDate) {
                return false;
            }
            if (filters.endDate && log.timestamp > filters.endDate) {
                return false;
            }
            
            // Filter by search term
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                const messageStr = typeof log.message === 'string' 
                    ? log.message 
                    : JSON.stringify(log.message);
                if (!messageStr.toLowerCase().includes(searchTerm)) {
                    return false;
                }
            }
            
            // Filter by event type (for JSON messages)
            if (filters.eventType && log.message && typeof log.message === 'object') {
                if (log.message.event_type !== filters.eventType) {
                    return false;
                }
            }
            
            return true;
        });
    }

    // Group logs by different criteria
    groupLogs(logs, groupBy = 'date') {
        const groups = {};
        
        logs.forEach(log => {
            if (!log) return;
            
            let key;
            switch (groupBy) {
                case 'date':
                    key = log.timestamp.toDateString();
                    break;
                case 'level':
                    key = log.level;
                    break;
                case 'logger':
                    key = log.logger;
                    break;
                case 'event_type':
                    key = log.message?.event_type || 'unknown';
                    break;
                case 'hour':
                    key = log.timestamp.toISOString().slice(0, 13) + ':00';
                    break;
                default:
                    key = 'other';
            }
            
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(log);
        });
        
        return groups;
    }

    // Get compliance statistics
    getComplianceStats(logs) {
        const stats = {
            totalEvents: 0,
            securityEvents: 0,
            complianceViolations: 0,
            vendorRegistrations: 0,
            statusChanges: 0,
            documentUploads: 0,
            errors: 0,
            performanceIssues: 0
        };
        
        logs.forEach(log => {
            if (!log) return;
            
            stats.totalEvents++;
            
            if (log.level === 'error') {
                stats.errors++;
            }
            
            if (log.message && typeof log.message === 'object') {
                const eventType = log.message.event_type;
                
                switch (eventType) {
                    case 'VENDOR_REGISTRATION':
                        stats.vendorRegistrations++;
                        break;
                    case 'VENDOR_STATUS_CHANGE':
                        stats.statusChanges++;
                        break;
                    case 'DOCUMENT_UPLOAD':
                        stats.documentUploads++;
                        break;
                    case 'COMPLIANCE_VIOLATION':
                        stats.complianceViolations++;
                        break;
                    case 'SECURITY_LOGIN_FAILURE':
                    case 'SECURITY_UNAUTHORIZED_ACCESS':
                    case 'SECURITY_DATA_BREACH':
                        stats.securityEvents++;
                        break;
                    case 'PERFORMANCE_METRIC':
                        if (log.message.duration_ms > 5000) { // 5 seconds threshold
                            stats.performanceIssues++;
                        }
                        break;
                }
            }
        });
        
        return stats;
    }

    // Get risk assessment from logs
    getRiskAssessment(logs) {
        const risks = {
            high: [],
            medium: [],
            low: []
        };
        
        logs.forEach(log => {
            if (!log || !log.message || typeof log.message !== 'object') return;
            
            const message = log.message;
            
            // Check for high-risk events
            if (message.event_type === 'COMPLIANCE_VIOLATION' && message.severity === 'CRITICAL') {
                risks.high.push({
                    type: 'Compliance Violation',
                    description: message.description,
                    timestamp: log.timestamp,
                    vendor_id: message.vendor_id
                });
            }
            
            if (message.event_type?.startsWith('SECURITY_') && message.risk_level === 'HIGH') {
                risks.high.push({
                    type: 'Security Event',
                    description: message.event_type,
                    timestamp: log.timestamp,
                    ip_address: message.ip_address
                });
            }
            
            // Check for medium-risk events
            if (message.event_type === 'COMPLIANCE_VIOLATION' && message.severity === 'HIGH') {
                risks.medium.push({
                    type: 'Compliance Violation',
                    description: message.description,
                    timestamp: log.timestamp,
                    vendor_id: message.vendor_id
                });
            }
            
            // Check for suspicious activity
            if (message.event_type === 'DUPLICATE_REGISTRATION_ATTEMPT') {
                risks.medium.push({
                    type: 'Suspicious Activity',
                    description: 'Duplicate registration attempt',
                    timestamp: log.timestamp,
                    ip_address: message.ip_address
                });
            }
        });
        
        return risks;
    }

    // Export logs for compliance reporting
    exportLogsForCompliance(logs, format = 'json') {
        const complianceLogs = logs.filter(log => 
            log && log.message && typeof log.message === 'object' && 
            (log.message.event_type === 'VENDOR_REGISTRATION' ||
             log.message.event_type === 'VENDOR_STATUS_CHANGE' ||
             log.message.event_type === 'COMPLIANCE_VIOLATION' ||
             log.message.event_type === 'DOCUMENT_UPLOAD')
        );
        
        switch (format) {
            case 'json':
                return JSON.stringify(complianceLogs, null, 2);
            case 'csv':
                return this.convertToCSV(complianceLogs);
            case 'pdf':
                return this.convertToPDF(complianceLogs);
            default:
                return JSON.stringify(complianceLogs, null, 2);
        }
    }

    // Convert logs to CSV format
    convertToCSV(logs) {
        const headers = ['Timestamp', 'Event Type', 'User ID', 'IP Address', 'Details'];
        const rows = logs.map(log => [
            log.timestamp.toISOString(),
            log.message?.event_type || 'unknown',
            log.message?.user_id || 'N/A',
            log.message?.ip_address || 'N/A',
            JSON.stringify(log.message?.details || log.message)
        ]);
        
        return [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');
    }

    // Convert logs to PDF (placeholder - would need a PDF library)
    convertToPDF(logs) {
        // This would require a PDF generation library like jsPDF
        console.log('PDF export not implemented - use JSON or CSV instead');
        return null;
    }

    // Get audit trail for a specific vendor
    getVendorAuditTrail(logs, vendorId) {
        return logs.filter(log => 
            log && log.message && typeof log.message === 'object' &&
            log.message.vendor_id === vendorId
        ).sort((a, b) => a.timestamp - b.timestamp);
    }

    // Get user activity timeline
    getUserActivityTimeline(logs, userId) {
        return logs.filter(log => 
            log && log.message && typeof log.message === 'object' &&
            log.message.user_id === userId
        ).sort((a, b) => a.timestamp - b.timestamp);
    }
}

export default LogViewer; 