const on = 1

if (on === 0) {
    const aimusic = require('./ai-music/index.js');
    aimusic()
}

if (on === 1) {
    const actorCritic = require('./actor-critic/main.js');
    actorCritic()
}