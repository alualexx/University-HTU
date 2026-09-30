const EventEmitter = require('events');
const { v4: uuidv4 } = require('uuid');

class HTTUEventBus extends EventEmitter {
  constructor() {
    super();
    this.history = [];
    this.maxHistory = 500;
  }

  /**
   * Publish a standardized HTTU Domain Event
   * @param {string} eventType 
   * @param {string} aggregateType 
   * @param {string} aggregateId 
   * @param {object} data 
   */
  publish(eventType, aggregateType, aggregateId, data = {}) {
    const event = {
      event_id: uuidv4(),
      event_type: eventType,
      aggregate_type: aggregateType,
      aggregate_id: aggregateId,
      timestamp: new Date().toISOString(),
      data
    };

    // Keep bounded audit trail
    this.history.unshift(event);
    if (this.history.length > this.maxHistory) {
      this.history.pop();
    }

    console.log(`[EventBus] ${eventType} published for ${aggregateType}:${aggregateId}`);
    this.emit(eventType, event);
    this.emit('*', event);
    return event;
  }

  getAuditTrail(limit = 50) {
    return this.history.slice(0, limit);
  }
}

const eventBus = new HTTUEventBus();
module.exports = eventBus;
